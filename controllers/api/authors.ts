import asyncHandler from "express-async-handler";
import type { NextFunction, Request, Response } from "express";
import { book } from "@/models/book.js";
import { copy } from "@/models/copy.js";
import { HttpStatusError } from "@/helper/index.js";
import { StatusCodes } from "http-status-codes";
import { validationResult } from "express-validator";
import { author } from "@/models/author.js";
import { getFullPageTitle } from "@/helper/get-full-page-title.js";

/**
 *
 */
export const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      books: await book
        .find({}, "title author")
        .sort({ title: 1 })
        .populate("author")
        .exec(),
    });
  },
);

export const save = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    const authorInstance = new author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      dateOfDeath: req.body.dateOfDeath,
    });

    if (!errors.isEmpty()) {
      res.json({
        title: getFullPageTitle("Create Author"),
        author: authorInstance,
        errors: errors.array(),
      });

      return;
    } else {
      await authorInstance.save();

      res.status(StatusCodes.OK);
    }
  },
);

export const deleteAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

/**
 *
 */
export const getById = asyncHandler(
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

    res.json({
      book: bookObject,
      copies: bookInstances,
    });
  },
);

export const updateBook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const deleteById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {},
);
