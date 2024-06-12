import { mongooseCopy } from "../models/mongoose/copy.js";
import { mongooseBook } from "../models/mongoose/book.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { getFullPageTitle } from "../helper/get-full-page-title.js";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import path from "node:path";
import { HttpStatusError } from "../helper/index.js";

const copyViewDirectory = "copy";

/**
 *
 */
export const getCopies = asyncHandler(async (req: Request, res: Response) => {
  const allBookInstances = await mongooseCopy.find().populate("book").exec();

  res.render(path.join(copyViewDirectory, "list"), {
    bookInstanceList: allBookInstances,
  });
});

/**
 *
 */
export const getCopyById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookInstanceObject = await mongooseCopy
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

    res.render(path.join(copyViewDirectory, "detail"), {
      title: getFullPageTitle("Book:"),
      bookInstance: bookInstanceObject,
    });
  },
);

/**
 *
 */
export const getCreateCopy = asyncHandler(
  async (req: Request, res: Response) => {
    const allBooks = await mongooseBook
      .find({}, "title")
      .sort({ title: 1 })
      .exec();

    res.render(path.join(copyViewDirectory, "form"), {
      title: getFullPageTitle("Create BookInstance"),
      bookList: allBooks,
    });
  },
);

/**
 *
 */
export const postCreateCopy = [
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

    const bookInstanceObject = new mongooseCopy({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
    });

    if (!errors.isEmpty()) {
      const allBooks = await mongooseBook
        .find({}, "title")
        .sort({ title: 1 })
        .exec();

      res.render(path.join(copyViewDirectory, "form"), {
        title: getFullPageTitle("Create BookInstance"),
        bookList: allBooks,
        selectedBook: bookInstanceObject._id,
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
export const getDeleteCopy = asyncHandler(
  async (req: Request, res: Response) => {
    const bookInstanceObject = await mongooseCopy
      .findById(req.params.id)
      .populate("book")
      .exec();

    if (!bookInstanceObject) {
      res.redirect("/catalog/copies");
    }

    res.render(path.join(copyViewDirectory, "delete"), {
      title: getFullPageTitle("Delete Book Instance"),
      bookInstance: bookInstanceObject,
    });
  },
);

/**
 *
 */
export const deleteDeleteCopy = asyncHandler(
  async (req: Request, res: Response) => {
    await mongooseCopy.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/copies");
  },
);

/**
 *
 */
export const getUpdateCopy = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [copy, allBooks] = await Promise.all([
      mongooseCopy.findById(req.params.id).populate("book").exec(),
      mongooseBook.find(),
    ]);

    if (!copy) {
      const err = new HttpStatusError(
        StatusCodes.NOT_FOUND,
        "Book copy not found",
      );

      next(err);

      return;
    }

    res.render(path.join(copyViewDirectory, "form"), {
      title: getFullPageTitle("Update Book Instance"),
      bookList: allBooks,
      selectedBook: copy._id,
      copy,
    });
  },
);

/**
 *
 */
export const patchUpdateCopy = [
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

    const bookInstanceObject = new mongooseCopy({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      dueBack: req.body.dueBack,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allBooks = await mongooseBook.find({}, "title").exec();

      res.render(path.join(copyViewDirectory, "form"), {
        title: getFullPageTitle("Update Book Instance"),
        bookList: allBooks,
        selectedBook: bookInstanceObject._id,
        errors: errors.array(),
        bookInstance: bookInstanceObject,
      });

      return;
    } else {
      await mongooseBook.findByIdAndUpdate(req.params.id, mongooseCopy, {});

      res.redirect(bookInstanceObject.url.href);
    }
  }),
];
