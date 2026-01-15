import Book from "./book.model.js";
import { generateAccessionNumbers } from "./library.utils.js";

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
