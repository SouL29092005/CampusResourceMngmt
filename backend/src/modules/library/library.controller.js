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
