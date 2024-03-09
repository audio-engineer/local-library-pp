import { genre } from "@/models/genre.js";
import { book } from "@/models/book.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import path from "path";
import type { NextFunction, Request, Response } from "express";
import { getFullPageTitle } from "@/helper/get-full-page-title.js";
import { StatusCodes } from "http-status-codes";
import { HttpStatusError } from "@/helper/index.js";

const genreViewDirectory = "genre";

/**
 * GET Genre list
 */
export const genreList = asyncHandler(async (req: Request, res: Response) => {
  const allGenres = await genre.find().sort({ name: 1 }).exec();

  res.render(path.join(genreViewDirectory, "list"), {
    title: getFullPageTitle("Genre List"),
    listGenres: allGenres,
  });
});

/**
 *
 */
export const genreDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [genreObject, booksInGenre] = await Promise.all([
      genre.findById(req.params.id).exec(),
      book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (!genreObject) {
      const err = new HttpStatusError(StatusCodes.NOT_FOUND, "Genre not found");

      next(err);

      return;
    }

    res.render(path.join(genreViewDirectory, "detail"), {
      title: getFullPageTitle("Genre Detail"),
      genre: genreObject,
      genreBooks: booksInGenre,
    });
  },
);

/**
 *
 * @param req
 * @param res
 */
export const genreCreateGet = (req: Request, res: Response): void => {
  res.render(path.join(genreViewDirectory, "form"), {
    title: getFullPageTitle("Create Genre"),
  });
};

/**
 *
 */
export const genreCreatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const genreObject = new genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render(path.join(genreViewDirectory, "form"), {
        title: getFullPageTitle("Create Genre"),
        genre: genreObject,
        errors: errors.array(),
      });

      return;
    } else {
      const genreExists = await genre
        .findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (genreExists) {
        res.redirect(genreExists.url.href);
      } else {
        await genreObject.save();

        res.redirect(genreObject.url.href);
      }
    }
  }),
];

/**
 *
 */
export const genreDeleteGet = asyncHandler(
  async (req: Request, res: Response) => {
    const [genreObject, booksInGenre] = await Promise.all([
      genre.findById(req.params.id).exec(),
      book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (!genreObject) {
      res.redirect("/catalog/genres");
    }

    res.render(path.join(genreViewDirectory, "delete"), {
      title: getFullPageTitle("Delete Genre"),
      genre: genreObject,
      genreBooks: booksInGenre,
    });
  },
);

/**
 *
 */
export const genreDeletePost = asyncHandler(
  async (req: Request, res: Response) => {
    const [genreObject, booksInGenre] = await Promise.all([
      genre.findById(req.params.id).exec(),
      book.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (0 < booksInGenre.length) {
      res.render(path.join(genreViewDirectory, "delete"), {
        title: getFullPageTitle("Delete Genre"),
        genre: genreObject,
        genreBooks: booksInGenre,
      });

      return;
    } else {
      await genre.findByIdAndDelete(req.body.id);

      res.redirect("/catalog/genres");
    }
  },
);

/**
 *
 */
export const genreUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const genreObject = await genre.findById(req.params.id).exec();

    if (!genreObject) {
      const err = new HttpStatusError(StatusCodes.NOT_FOUND, "Genre not found");

      next(err);

      return;
    }

    res.render(path.join(genreViewDirectory, "form"), {
      title: getFullPageTitle("Update Genre"),
      genre: genreObject,
    });
  },
);

/**
 *
 */
export const genreUpdatePost = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const genreObject = new genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render(path.join(genreViewDirectory, "form"), {
        title: getFullPageTitle("Update Genre"),
        genre: genreObject,
        errors: errors.array(),
      });

      return;
    } else {
      await genre.findByIdAndUpdate(req.params.id, genreObject);

      res.redirect(genreObject.url.href);
    }
  }),
];
