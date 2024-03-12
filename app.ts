import createError from "http-errors";
import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "@/routes/index.js";
import booksRouter from "@/routes/books.js";
import usersRouter from "@/routes/users.js";
import authorsRouter from "@/routes/authors.js";
import copiesRouter from "@/routes/copies.js";
import genresRouter from "@/routes/genres.js";
import booksApiRouter from "@/routes/api/books.js";
import authorsApiRouter from "@/routes/api/api-router.js";
import genresApiRouter from "@/routes/api/genres.js";
import copiesApiRouter from "@/routes/api/copies.js";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import RateLimit from "express-rate-limit";
import robots from "express-robots-txt";
import favicon from "express-favicon";
import { StatusCodes } from "http-status-codes";
import type { HttpStatusError } from "@/helper/index.js";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

const secondsInMinute = 60;
const millisecondsInSeconds = 1000;

const limiter = RateLimit({
  windowMs: 15 * secondsInMinute * millisecondsInSeconds,
  limit: 100,
});
app.use(limiter);

mongoose.set("strictQuery", false);

const devDbUrl =
  "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI ?? devDbUrl;

const main = async (): Promise<void> => {
  await mongoose.connect(mongoDB);
};

try {
  await main();
} catch (error) {
  console.log(error);
}

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

app.use(compression());

app.use(express.static(path.join(import.meta.dirname, "public")));

app.use("/", indexRouter);
app.use("/v1", authorsApiRouter);
app.use("/v1", booksApiRouter);
app.use("/v1", copiesApiRouter);
app.use("/v1", genresApiRouter);
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);
app.use("/copies", copiesRouter);
app.use("/genres", genresRouter);
app.use("/users", usersRouter);

app.use(
  (req: Readonly<Request>, res: Readonly<Response>, next: NextFunction) => {
    next(createError(StatusCodes.NOT_FOUND));
  },
);

app.use((err: HttpStatusError, req: Readonly<Request>, res: Response) => {
  res.locals.message = err.message;

  let error = {};

  if ("development" === req.app.get("env")) {
    error = err;
  }

  res.locals.error = error;

  res.status(err.httpStatusCode);

  res.render("error");
});

app.use(robots(path.join(import.meta.dirname, "public", "robots.txt")));
app.use(favicon(path.join(import.meta.dirname, "public", "favicon.ico")));

export default app;
