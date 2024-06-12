import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { mongooseCopy } from "../models/mongoose/copy.js";
import { mongooseGenre } from "../models/mongoose/genre.js";
import type { JsonT } from "./interfaces/json.js";
import type {
  SequelizeAuthor,
  SequelizeBook,
} from "../models/sequelize/index.js";

/**
 * GET home page
 */
export const index = asyncHandler(async (req: Request, res: Response) => {
  let numberOfAuthors = 0;
  let numberOfBooks = 0;

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/${req.cookies.database}/authors`,
    );
    const responseJson = (await response.json()) as JsonT<SequelizeAuthor>;

    numberOfAuthors = responseJson.data.length;
  } catch (error) {
    console.error(error);
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/${req.cookies.database}/books`,
    );
    const responseJson = (await response.json()) as JsonT<SequelizeBook>;

    numberOfBooks = responseJson.data.length;
  } catch (error) {
    console.error(error);
  }

  res.render("index", {
    numberOfBooks,
    numberOfCopies: await mongooseCopy.countDocuments({}).exec(),
    bookInstanceAvailableCount: await mongooseCopy
      .countDocuments({ status: "Available" })
      .exec(),
    numberOfAuthors,
    genreCount: await mongooseGenre.countDocuments({}).exec(),
  });
});
