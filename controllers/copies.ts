import { copy } from "@/models/copy.js";
import { book } from "@/models/book.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { getFullPageTitle } from "@/helper/get-full-page-title.js";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import { HttpStatusError } from "@/helper/index.js";

const bookInstanceViewDirectory = "book-instance";

/**
 *
 */
export const bookInstanceList = asyncHandler(
  async (req: Request, res: Response) => {
    const allBookInstances = await copy.find().populate("book").exec();

    res.render(path.join(bookInstanceViewDirectory, "list"), {
      title: getFullPageTitle("Book Copies"),
      bookInstanceList: allBookInstances,
    });
  },
);

/**
 *
 */
export const bookInstanceDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookInstanceObject = await copy
      .findById(req.params.id)
      .populate("book")
      .exec();

    if (!bookInstanceObject) {
      const err = new HttpStatusError(
        StatusCodes.NOT_FOUND,
        "Book copy not found",
      );

      next(err);

      return;
    }

    res.render(path.join(bookInstanceViewDirectory, "detail"), {
      title: getFullPageTitle("Book:"),
      bookInstance: bookInstanceObject,
    });
  },
);

/**
 *
 */
export const bookInstanceCreateGet = asyncHandler(
  async (req: Request, res: Response) => {
    const allBooks = await book.find({}, "title").sort({ title: 1 }).exec();

    res.render(path.join(bookInstanceViewDirectory, "form"), {
      title: getFullPageTitle("Create BookInstance"),
      bookList: allBooks,
    });
  },
);

/**
 *
 */
export const bookInstanceCreatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const bookInstanceObject = new copy({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
    });

    if (!errors.isEmpty()) {
      const allBooks = await book.find({}, "title").sort({ title: 1 }).exec();

      res.render(path.join(bookInstanceViewDirectory, "form"), {
        title: getFullPageTitle("Create BookInstance"),
        bookList: allBooks,
        selectedBook: bookInstanceObject.book._id,
        errors: errors.array(),
        bookInstance: bookInstanceObject,
      });

      return;
    } else {
      await bookInstanceObject.save();

      res.redirect(bookInstanceObject.url.href);
    }
  }),
];

/**
 *
 */
export const bookInstanceDeleteGet = asyncHandler(
  async (req: Request, res: Response) => {
    const bookInstanceObject = await copy
      .findById(req.params.id)
      .populate("book")
      .exec();

    if (!bookInstanceObject) {
      res.redirect("/catalog/book-instances");
    }

    res.render(path.join(bookInstanceViewDirectory, "delete"), {
      title: getFullPageTitle("Delete Book Instance"),
      bookInstance: bookInstanceObject,
    });
  },
);

/**
 *
 */
export const bookInstanceDeletePost = asyncHandler(
  async (req: Request, res: Response) => {
    await copy.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/book-instances");
  },
);

/**
 *
 */
export const bookInstanceUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [bookInstanceObject, allBooks] = await Promise.all([
      copy.findById(req.params.id).populate("book").exec(),
      book.find(),
    ]);

    if (!bookInstanceObject) {
      const err = new HttpStatusError(
        StatusCodes.NOT_FOUND,
        "Book copy not found",
      );

      next(err);

      return;
    }

    res.render(path.join(bookInstanceViewDirectory, "form"), {
      title: getFullPageTitle("Update Book Instance"),
      bookList: allBooks,
      selectedBook: bookInstanceObject.book._id,
      bookInstance: bookInstanceObject,
    });
  },
);

/**
 *
 */
export const bookInstanceUpdatePost = [
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const bookInstanceObject = new copy({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allBooks = await book.find({}, "title").exec();

      res.render(path.join(bookInstanceViewDirectory, "form"), {
        title: getFullPageTitle("Update Book Instance"),
        bookList: allBooks,
        selectedBook: bookInstanceObject.book._id,
        errors: errors.array(),
        bookInstance: bookInstanceObject,
      });

      return;
    } else {
      await book.findByIdAndUpdate(req.params.id, copy, {});

      res.redirect(bookInstanceObject.url.href);
    }
  }),
];
