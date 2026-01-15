import Book from "./book.model.js";

export const generateAccessionNumbers = async (count, category) => {
  const lastBook = await Book.findOne(
    { category },
    { accessionNumber: 1 }
  )
    .sort({ createdAt: -1 })
    .lean();

  let start = 1;

  if (lastBook?.accessionNumber) {
    const parts = lastBook.accessionNumber.split("-");
    start = parseInt(parts[parts.length - 1]) + 1;
  }

  const year = new Date().getFullYear();

  return Array.from({ length: count }, (_, i) => ({
    accessionNumber: `ACC-${year}-${category}-${String(start + i).padStart(6, "0")}`,
    bookNumber: `LIB-${category}-${String(start + i).padStart(6, "0")}`,
  }));
};
