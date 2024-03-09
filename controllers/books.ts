import { book } from "@/models/book.js";
import { author } from "@/models/author.js";
import { genre } from "@/models/genre.js";
import { copy } from "@/models/copy.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { getFullPageTitle } from "@/helper/get-full-page-title.js";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { HttpStatusError } from "@/helper/index.js";

const bookViewDirectory = "book";

/**
 * Book GET requests.
 */
export const bookIndex = asyncHandler(async (req: Request, res: Response) => {
  res.render("index", {
    title: getFullPageTitle("Home"),
    bookCount: await book.countDocuments({}).exec(),
    bookInstanceCount: await copy.countDocuments({}).exec(),
    bookInstanceAvailableCount: await copy
      .countDocuments({ status: "Available" })
      .exec(),
    authorCount: await author.countDocuments({}).exec(),
    genreCount: await genre.countDocuments({}).exec(),
  });
});

/**
 *
 */
export const bookList = asyncHandler(async (req: Request, res: Response) => {
  const allBooks = await book
    .find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();

  res.render(path.join(bookViewDirectory, "list"), {
    title: getFullPageTitle("Book List"),
    bookList: allBooks,
  });
});

/**
 *
 */
export const bookDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [bookObject, bookInstances] = await Promise.all([
      book.findById(req.params.id).populate("author").populate("genre").exec(),
      copy.find({ book: req.params.id }).exec(),
    ]);

    if (!bookObject) {
      const err = new HttpStatusError(StatusCodes.NOT_FOUND, "Book not found");

      next(err);

      return;
    }

    res.render(path.join(bookViewDirectory, "detail"), {
      title: getFullPageTitle(bookObject.title),
      book: bookObject,
      bookInstances: bookInstances,
    });
  },
);

/**
 *
 */
export const bookCreateGet = asyncHandler(
  async (req: Request, res: Response) => {
    const [allAuthors, allGenres] = await Promise.all([
      author.find().sort({ lastName: 1 }).exec(),
      genre.find().sort({ name: 1 }).exec(),
    ]);

    res.render(path.join(bookViewDirectory, "form"), {
      title: getFullPageTitle("Create Book"),
      authors: allAuthors,
      genres: allGenres,
    });
  },
);

/**
 * POST Create book
 */
export const bookCreatePost = [
  (req: Request, res: Response, next: NextFunction): void => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }

    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const bookDocument = new book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        author.find().sort({ lastName: 1 }).exec(),
        genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (bookDocument.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render(path.join(bookViewDirectory, "form"), {
        title: getFullPageTitle("Create Book"),
        authors: allAuthors,
        genres: allGenres,
        book: bookDocument,
        errors: errors.array(),
      });
    } else {
      await bookDocument.save();

      res.redirect(bookDocument.url.href);
    }
  }),
];

/**
 * GET Book delete
 */
export const bookDeleteGet = asyncHandler(
  async (req: Request, res: Response) => {
    const [bookObject, bookInstances] = await Promise.all([
      book.findById(req.params.id).populate("author").populate("genre").exec(),
      copy.find({ book: req.params.id }).exec(),
    ]);

    if (!bookObject) {
      res.redirect("/catalog/books");
    }

    res.render(path.join(bookViewDirectory, "delete"), {
      title: "Delete Book",
      book: bookObject,
      bookInstances: bookInstances,
    });
  },
);

/**
 * POST Book delete
 */
export const bookDeletePost = asyncHandler(
  async (req: Request, res: Response) => {
    const [bookObject, bookInstances] = await Promise.all([
      book.findById(req.params.id).populate("author").populate("genre").exec(),
      copy.find({ book: req.params.id }).exec(),
    ]);

    if (!bookObject) {
      res.redirect("/catalog/books");
    }

    if (0 < bookInstances.length) {
      res.render(path.join(bookViewDirectory, "delete"), {
        title: "Delete Book",
        book: bookObject,
        bookInstances: bookInstances,
      });

      return;
    } else {
      await book.findByIdAndDelete(req.body.id);

      res.redirect("/catalog/books");
    }
  },
);

/**
 * GET book update
 */
export const bookUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [bookObject, allAuthors, allGenres] = await Promise.all([
      book.findById(req.params.id).populate("author").exec(),
      author.find().sort({ lastName: 1 }).exec(),
      genre.find().sort({ name: 1 }).exec(),
    ]);

    if (!bookObject) {
      const err = new HttpStatusError(StatusCodes.NOT_FOUND, "Book not found");

      next(err);

      return;
    }

    allGenres.forEach((genre) => {
      if (bookObject.genre.includes(genre._id)) {
        genre.checked = "true";
      }
    });

    res.render(path.join(bookViewDirectory, "form"), {
      title: getFullPageTitle("Update Book"),
      authors: allAuthors,
      genres: allGenres,
      book: bookObject,
    });
  },
);

/**
 * POST Book update
 */
export const bookUpdatePost = [
  (req: Request, res: Response, next: NextFunction): void => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }

    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const bookObject = new book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allAuthors, allGenres] = await Promise.all([
        author.find().sort({ lastName: 1 }).exec(),
        genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (bookObject.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }

      res.render(path.join(bookViewDirectory, "form"), {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: bookObject,
        errors: errors.array(),
      });

      return;
    } else {
      const thebook = await book.findByIdAndUpdate(req.params.id, book, {});

      res.redirect(thebook.url.href);
    }
  }),
];
