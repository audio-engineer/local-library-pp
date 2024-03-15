import createError from "http-errors";
import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import { ApiRouter } from "./routes/api/api-router.js";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import RateLimit from "express-rate-limit";
import robots from "express-robots-txt";
import favicon from "express-favicon";
import { StatusCodes } from "http-status-codes";
import type { HttpStatusError } from "./helper/index.js";
import dotenv from "dotenv";
import { author } from "./models/author.js";
import { book } from "./models/book.js";
import { copy } from "./models/copy.js";
import { genre } from "./models/genre.js";
import authorRouter from "./routes/authors.js";
import bookRouter from "./routes/books.js";
import copyRouter from "./routes/copies.js";
import genreRouter from "./routes/genres.js";
import userRouter from "./routes/users.js";

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

const connectToMongoDb = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI ?? "");
};

try {
  await connectToMongoDb();
} catch (error) {
  console.log(error);
}

app.set("views", path.normalize("views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

app.use(compression());

app.use(express.static(path.normalize("public")));

app.use("/", indexRouter);
app.use("/api", new ApiRouter(author, "authors").routes);
app.use("/api", new ApiRouter(book, "books").routes);
app.use("/api", new ApiRouter(copy, "copies").routes);
app.use("/api", new ApiRouter(genre, "genres").routes);
app.use("/", authorRouter);
app.use("/", bookRouter);
app.use("/", copyRouter);
app.use("/", genreRouter);
app.use("/", userRouter);

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

app.use(robots(path.join(path.normalize("public"), "robots.txt")));
app.use(favicon(path.join(path.normalize("public"), "favicon.ico")));

export default app;
