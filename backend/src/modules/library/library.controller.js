import * as libraryService from "./library.service.js";

export const addBooks = async (req, res, next) => {
  try {
    const books = await libraryService.addBooksInBulk(req.body);
    res.status(201).json({
      message: "Books added successfully",
      count: books.length,
    });
  } catch (err) {
    next(err);
  }
};


export const issueBook = async (req, res, next) => {
  try {
    const issue = await libraryService.issueBook(req.body);

    res.status(201).json({
      message: "Book issued successfully",
      data: issue,
    });
  } catch (err) {
    next(err);
  }
};


export const returnBook = async (req, res, next) => {
  try {
    const result = await libraryService.returnBook(req.body);

    res.status(200).json({
      message: "Book returned successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};


export const updateBookStatus = async (req, res, next) => {
  try {
    const result = await libraryService.removeBook(req.body);

    res.status(200).json({
      message: "Book status updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};