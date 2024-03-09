import { author } from "@/models/author.js";
import { book } from "@/models/book.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import { getFullPageTitle } from "@/helper/get-full-page-title.js";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import { HttpStatusError } from "@/helper/index.js";

const authorViewDirectory = "author";

/**
 *
 */
export const authorList = asyncHandler(async (req: Request, res: Response) => {
  const allAuthors = await author.find().sort({ lastName: 1 }).exec();

  res.render(path.join(authorViewDirectory, "list"), {
    title: getFullPageTitle("Author List"),
    authorList: allAuthors,
  });
});

/**
 *
 */
export const authorDetail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const [authorInstance, allBooksByAuthor] = await Promise.all([
      author.findById(req.params.id).exec(),
      book.find({ author: req.params.id }, "title summary").exec(),
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
 * @param req
 * @param res
 */
export const authorCreateGet = (req: Request, res: Response): void => {
  res.render(path.join(authorViewDirectory, "form"), {
    title: getFullPageTitle("Create Author"),
  });
};

/**
 *
 */
export const authorCreatePost = [
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

    const authorInstance = new author({
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

      res.redirect(authorInstance.url.href);
    }
  }),
];

/**
 *
 */
export const authorDeleteGet = asyncHandler(
  async (req: Request, res: Response) => {
    const [authorInstance, allBooksByAuthor] = await Promise.all([
      author.findById(req.params.id).exec(),
      book.find({ author: req.params.id }, "title summary").exec(),
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
export const authorDeletePost = asyncHandler(
  async (req: Request, res: Response) => {
    const [authorObject, allBooksByAuthor] = await Promise.all([
      author.findById(req.params.id).exec(),
      book.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (0 < allBooksByAuthor.length) {
      res.render(path.join(authorViewDirectory, "delete"), {
        title: getFullPageTitle("Delete Author"),
        author: authorObject,
        authorBooks: allBooksByAuthor,
      });

      return;
    } else {
      await author.findByIdAndDelete(req.body.authorid);

      res.redirect("/catalog/author");
    }
  },
);

/**
 *
 */
export const authorUpdateGet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorInstance = await author.findById(req.params.id).exec();

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
export const authorUpdatePost = [
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

    const authorInstance = new author({
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
      await author.findByIdAndUpdate(req.params.id, authorInstance);

      res.redirect(authorInstance.url.href);
    }
  }),
];
