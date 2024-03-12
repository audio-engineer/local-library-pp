import asyncHandler from "express-async-handler";
import type { NextFunction, Request, Response } from "express";
import { book } from "@/models/book.js";
import { copy } from "@/models/copy.js";
import { HttpStatusError } from "@/helper/index.js";
import { StatusCodes } from "http-status-codes";

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
  async (req: Request, res: Response, next: NextFunction) => {},
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
