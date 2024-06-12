import type { IBookBaseDocument } from "../models/mongoose/book.js";
import { mongooseBook } from "../models/mongoose/book.js";
import { mongooseAuthor } from "../models/mongoose/author.js";
import { mongooseGenre } from "../models/mongoose/genre.js";
import { mongooseCopy } from "../models/mongoose/copy.js";
import asyncHandler from "express-async-handler";
import { getFullPageTitle } from "../helper/get-full-page-title.js";
import type { Request, Response } from "express";
import path from "path";
import type { JsonT } from "./interfaces/json.js";

const bookViewDirectory = "book";

/**
 *
 */
export const getBooks = asyncHandler(async (req: Request, res: Response) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/${req.cookies.database}/books`,
  );
  const bookObjectJson = (await response.json()) as JsonT<IBookBaseDocument>;

  res.render(path.join(bookViewDirectory, "list"), {
    rows: bookObjectJson.data.map(({ title, author, url }) => [
      { url, data: title },
      { data: author },
    ]),
  });
});

/**
 *
 */
export const getBookById = asyncHandler(async (req: Request, res: Response) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/${req.cookies.database}/books/${req.params.id}`,
  );
  const bookObjectJson = (await response.json()) as JsonT<IBookBaseDocument>;

  res.render(path.join(bookViewDirectory, "detail"), {
    book: bookObjectJson.data,
  });
});

/**
 *
 */
export const getCreateBook = asyncHandler(
  async (req: Request, res: Response) => {
    const [allAuthors, allGenres] = await Promise.all([
      mongooseAuthor.find().sort({ lastName: 1 }).exec(),
      mongooseGenre.find().sort({ name: 1 }).exec(),
    ]);

    res.render(path.join(bookViewDirectory, "form"), {
      title: getFullPageTitle("Create Book"),
      authors: allAuthors,
      genres: allGenres,
    });
  },
);

/**
 * GET Book delete
 */
export const getDeleteBook = asyncHandler(
  async (req: Request, res: Response) => {
    const [bookObject, bookInstances] = await Promise.all([
      mongooseBook
        .findById(req.params.id)
        .populate("author")
        .populate("genre")
        .exec(),
      mongooseCopy.find({ book: req.params.id }).exec(),
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
export const deleteDeleteBook = asyncHandler(
  async (req: Request, res: Response) => {
    const [bookObject, bookInstances] = await Promise.all([
      mongooseBook
        .findById(req.params.id)
        .populate("author")
        .populate("genre")
        .exec(),
      mongooseCopy.find({ book: req.params.id }).exec(),
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
      await mongooseBook.findByIdAndDelete(req.body.id);

      res.redirect("/catalog/books");
    }
  },
);
