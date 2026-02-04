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


export const getActiveIssues = async (req, res, next) => {
  try {
    const issues = await libraryService.getActiveIssues();

    res.status(200).json({
      count: issues.length,
      data: issues,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyIssues = async (req, res, next) => {
  try {
    const issues = await libraryService.getIssuesByUser(req.user._id);

    res.status(200).json({
      count: issues.length,
      data: issues,
    });
  } catch (err) {
    next(err);
  }
};


export const searchBookByName = async (req, res, next) => {
  try {
    const { title } = req.query;

    const books = await libraryService.searchBookByName(title);

    res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    next(err);
  }
};
