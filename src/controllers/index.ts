import asyncHandler from "express-async-handler";
import { book } from "../models/book.js";
import type { Request, Response } from "express";
import { copy } from "../models/copy.js";
import { genre } from "../models/genre.js";
import { author } from "../models/author.js";

/**
 * Book GET requests.
 */
export const index = asyncHandler(async (req: Request, res: Response) => {
  res.render("index", {
    bookCount: await book.countDocuments({}).exec(),
    bookInstanceCount: await copy.countDocuments({}).exec(),
    bookInstanceAvailableCount: await copy
      .countDocuments({ status: "Available" })
      .exec(),
    authorCount: await author.countDocuments({}).exec(),
    genreCount: await genre.countDocuments({}).exec(),
  });
});
