import type { IAuthorBaseDocument } from "../models/mongoose/author.js";
import { mongooseAuthor } from "../models/mongoose/author.js";
import { mongooseBook } from "../models/mongoose/book.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { getFullPageTitle } from "../helper/get-full-page-title.js";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import { HttpStatusError } from "../helper/index.js";
import type { JsonT } from "./interfaces/json.js";

const authorViewDirectory = "author";

/**
 *
 */
export const getAuthors = asyncHandler(async (req: Request, res: Response) => {
  const response = await fetch(
    `http://localhost:3000/api/v1/${req.cookies.database}/authors`,
  );
  const responseJson = (await response.json()) as JsonT<IAuthorBaseDocument>;

  res.render(path.join(authorViewDirectory, "list"), {
    rows: responseJson.data.map(({ fullName, url, lifeSpan }) => [
      { url, data: fullName },
      { data: lifeSpan },
    ]),
  });
});

/**
 *
 */
export const getAuthorById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [authorInstance, allBooksByAuthor] = await Promise.all([
      mongooseAuthor.findById(req.params.id).exec(),
      mongooseBook.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (!authorInstance) {
      const err = new HttpStatusError(
        StatusCodes.NOT_FOUND,
        "Author not found",
      );

      next(err);

      return;
    }

    res.render(path.join(authorViewDirectory, "detail"), {
      title: getFullPageTitle("Author Detail"),
      author: authorInstance,
      authorBooks: allBooksByAuthor,
    });
  },
);

/**
 *
 * @param req -
 * @param res -
 */
export const getCreateAuthor = (req: Request, res: Response): void => {
  res.render(path.join(authorViewDirectory, "form"), {
    title: getFullPageTitle("Create Author"),
  });
};

/**
 *
 */
export const postCreateAuthor = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("dateOfBirth", "Invalid date of birth").isISO8601().toDate(),
  body("dateOfDeath", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const authorInstance = new mongooseAuthor({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      dateOfDeath: req.body.dateOfDeath,
    });

    if (!errors.isEmpty()) {
      res.render(path.join(authorViewDirectory, "form"), {
        title: getFullPageTitle("Create Author"),
        author: authorInstance,
        errors: errors.array(),
      });

      return;
    } else {
      await authorInstance.save();

      const images = req.files;

      if (!images) {
        res.sendStatus(StatusCodes.BAD_REQUEST);

        return;
      }

      const { image } = images;

      if (Array.isArray(image)) {
        res.sendStatus(StatusCodes.BAD_REQUEST);

        return;
      }

      await image.mv(
        path.join(path.normalize("public"), "images") + image.name,
      );

      res.redirect(authorInstance.url.href);
    }
  }),
];

/**
 *
 */
export const getDeleteAuthor = asyncHandler(
  async (req: Request, res: Response) => {
    const [authorInstance, allBooksByAuthor] = await Promise.all([
      mongooseAuthor.findById(req.params.id).exec(),
      mongooseBook.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (!authorInstance) {
      res.redirect("/catalog/author");
    }

    res.render(path.join(authorViewDirectory, "delete"), {
      title: getFullPageTitle("Delete Author"),
      author: authorInstance,
      authorBooks: allBooksByAuthor,
    });
  },
);

/**
 *
 */
export const deleteDeleteAuthor = asyncHandler(
  async (req: Request, res: Response) => {
    const [authorObject, allBooksByAuthor] = await Promise.all([
      mongooseAuthor.findById(req.params.id).exec(),
      mongooseBook.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (0 < allBooksByAuthor.length) {
      res.render(path.join(authorViewDirectory, "delete"), {
        title: getFullPageTitle("Delete Author"),
        author: authorObject,
        authorBooks: allBooksByAuthor,
      });

      return;
    } else {
      await mongooseAuthor.findByIdAndDelete(req.body.authorid);

      res.redirect("/catalog/author");
    }
  },
);

/**
 *
 */
export const getUpdateAuthor = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorInstance = await mongooseAuthor.findById(req.params.id).exec();

    if (!authorInstance) {
      const err = new HttpStatusError(
        StatusCodes.NOT_FOUND,
        "Author not found",
      );

      next(err);

      return;
    }

    res.render(path.join(authorViewDirectory, "form"), {
      title: getFullPageTitle("Update Author"),
      authorInstance,
    });
  },
);

/**
 *
 */
export const patchUpdateAuthor = [
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("dateOfBirth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("dateOfDeath", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);

    const authorInstance = new mongooseAuthor({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      dateOfDeath: req.body.dateOfDeath,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render(path.join(authorViewDirectory, "form"), {
        title: getFullPageTitle("Update Author"),
        author: authorInstance,
        errors: errors.array(),
      });

      return;
    } else {
      await mongooseAuthor.findByIdAndUpdate(req.params.id, authorInstance);

      res.redirect(authorInstance.url.href);
    }
  }),
];
