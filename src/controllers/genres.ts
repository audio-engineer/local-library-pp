import {
  type IGerneBaseDocument,
  mongooseGenre,
} from "../models/mongoose/genre.js";
import { mongooseBook } from "../models/mongoose/book.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import path from "path";
import type { NextFunction, Request, Response } from "express";
import { getFullPageTitle } from "../helper/get-full-page-title.js";
import { StatusCodes } from "http-status-codes";
import { HttpStatusError } from "../helper/index.js";
import type { JsonT } from "./interfaces/json.js";

const genreViewDirectory = "genre";

/**
 * GET Genre list
 */
export const getGenres = asyncHandler(async (req: Request, res: Response) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/${req.cookies.database}/genres`,
  );
  const responseJson = (await response.json()) as JsonT<IGerneBaseDocument>;

  res.render(path.join(genreViewDirectory, "list"), {
    rows: responseJson.data.map(({ name, url }) => [{ url, data: name }]),
  });
});

/**
 *
 */
export const getGenreById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [genreObject, booksInGenre] = await Promise.all([
      mongooseGenre.findById(req.params.id).exec(),
      mongooseBook.find({ genre: req.params.id }, "title summary").exec(),
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
 * @param req -
 * @param res -
 */
export const getCreateGenre = (req: Request, res: Response): void => {
  res.render(path.join(genreViewDirectory, "form"), {
    title: getFullPageTitle("Create Genre"),
  });
};

/**
 *
 */
export const postCreateGenre = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const genreObject = new mongooseGenre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render(path.join(genreViewDirectory, "form"), {
        title: getFullPageTitle("Create Genre"),
        genre: genreObject,
        errors: errors.array(),
      });

      return;
    } else {
      const genreExists = await mongooseGenre
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
export const getDeleteGenre = asyncHandler(
  async (req: Request, res: Response) => {
    const [genreObject, booksInGenre] = await Promise.all([
      mongooseGenre.findById(req.params.id).exec(),
      mongooseBook.find({ genre: req.params.id }, "title summary").exec(),
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
export const deleteDeleteGenre = asyncHandler(
  async (req: Request, res: Response) => {
    const [genreObject, booksInGenre] = await Promise.all([
      mongooseGenre.findById(req.params.id).exec(),
      mongooseBook.find({ genre: req.params.id }, "title summary").exec(),
    ]);

    if (0 < booksInGenre.length) {
      res.render(path.join(genreViewDirectory, "delete"), {
        title: getFullPageTitle("Delete Genre"),
        genre: genreObject,
        genreBooks: booksInGenre,
      });

      return;
    } else {
      await mongooseGenre.findByIdAndDelete(req.body.id);

      res.redirect("/catalog/genres");
    }
  },
);

/**
 *
 */
export const getUpdateGenre = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const genreObject = await mongooseGenre.findById(req.params.id).exec();

    if (!genreObject) {
      const err = new HttpStatusError(StatusCodes.NOT_FOUND, "Genre not found");

      next(err);

      return;
    }

    res.render(path.join(genreViewDirectory, "form"), {
      genre: genreObject,
    });
  },
);

/**
 *
 */
export const patchUpdateGenre = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const genreObject = new mongooseGenre({
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
      await mongooseGenre.findByIdAndUpdate(req.params.id, genreObject);

      res.redirect(genreObject.url.href);
    }
  }),
];
