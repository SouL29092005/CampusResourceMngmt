import Book from "./book.model.js";
import { generateAccessionNumbers } from "./library.utils.js";
import Issue from "./issue.model.js";
import Counter from "../../utils/counter.model.js";

export const addBooksInBulk = async (payload) => {
  const {
    title,
    author,
    isbn,
    category,
    publisher,
    publishedYear,
    copies,
  } = payload;

  if (copies <= 0) {
    throw new Error("Copies must be greater than zero");
  }

  const identifiers = await generateAccessionNumbers(copies, category);

  const books = identifiers.map((id) => ({
    title,
    author,
    isbn,
    category,
    publisher,
    publishedYear,
    accessionNumber: id.accessionNumber,
    bookNumber: id.bookNumber,
    status: "AVAILABLE",
  }));

  return await Book.insertMany(books, { ordered: true });
};


export const issueBook = async ({ accessionNumber, userId }) => {
  if (!accessionNumber || !userId) {
    throw new Error("accessionNumber and userId are required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findOne({
      accessionNumber,
      status: "AVAILABLE",
    }).session(session);

    if (!book) {
      throw new Error("Book not available or invalid accession number");
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "issue" },
      { $inc: { seq: 1 } },
      {
        new: true,
        upsert: true,
        session,
      }
    );

    const issueNumber = counter.seq;

    const issuedAt = new Date();
    const dueAt = new Date(issuedAt);
    dueAt.setDate(dueAt.getDate() + 30);

    const issue = await Issue.create(
      [
        {
          issueNumber,
          book: book._id,
          user: userId,
          issuedAt,
          dueAt,
          status: "ISSUED",
        },
      ],
      { session }
    );

    book.status = "ISSUED";
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();

    return issue[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


export const returnBook = async ({ accessionNumber }) => {
  if (!accessionNumber) {
    throw new Error("accessionNumber is required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const book = await Book.findOne({ accessionNumber }).session(session);

    if (!book) {
      throw new Error("Invalid accession number");
    }

    if (book.status !== "ISSUED") {
      throw new Error("Book is not currently issued");
    }

    const issue = await Issue.findOne({
      book: book._id,
      status: "ISSUED",
    }).session(session);

    if (!issue) {
      throw new Error("Active issue record not found");
    }

    const returnedAt = new Date();
    let fineAmount = 0;

    if (returnedAt > issue.dueAt) {
      const diffMs = returnedAt - issue.dueAt;
      const lateDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      fineAmount = lateDays * 2;
    }

    issue.returnedAt = returnedAt;
    issue.status = "RETURNED";
    issue.fineAmount = fineAmount;
    await issue.save({ session });

    book.status = "AVAILABLE";
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      issueId: issue.issueId,
      accessionNumber,
      fineAmount,
      returnedAt,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};


export const updateBookStatus = async ({ accessionNumber, status }) => {
  if (!accessionNumber || !status) {
    throw new Error("accessionNumber and status are required");
  }

  if (!["LOST", "DAMAGED"].includes(status)) {
    throw new Error("status must be LOST or DAMAGED");
  }

  const book = await Book.findOne({ accessionNumber });

  if (!book) {
    throw new Error("Invalid accession number");
  }

  book.status = status;
  await book.save();

  return {
    accessionNumber,
    status,
  };
};
