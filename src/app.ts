import createError from "http-errors";
import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import path from "node:path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { ApiRouter } from "./routes/api-router.js";
import compression from "compression";
import helmet from "helmet";
import mongoose from "mongoose";
import RateLimit from "express-rate-limit";
import robots from "express-robots-txt";
import favicon from "express-favicon";
import { StatusCodes } from "http-status-codes";
import type { HttpStatusError } from "./helper/index.js";
import dotenv from "dotenv";
import {
  mongooseAuthor,
  mongooseBook,
  mongooseCopy,
  mongooseGenre,
} from "./models/mongoose/index.js";
import { pagesRouter } from "./routes/pages.js";
import { sequelize } from "./database/sequelize.js";
import {
  SequelizeAuthor,
  SequelizeBook,
  SequelizeCopy,
  SequelizeGenre,
} from "./models/sequelize/index.js";
import fileUpload from "express-fileupload";
import { MongooseModelRepository } from "./models/mongoose-model-repository.js";
import { SequelizeModelRepository } from "./models/sequelize-model-repository.js";

dotenv.config();

const app: Express = express();

const secondsInMinute = 60;
const millisecondsInSeconds = 1000;

const limiter = RateLimit({
  windowMs: 15 * secondsInMinute * millisecondsInSeconds,
  limit: 100,
});
// app.use(limiter);

mongoose.set("strictQuery", false);

const connectToMongoDb = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI ?? "");
};

try {
  await connectToMongoDb();

  console.log("Connection to MongoDB has been established successfully.");
} catch (error) {
  console.log(error);
}

try {
  await sequelize.authenticate();

  console.log("Connection to MariaDB has been established successfully.");
} catch (error) {
  console.error(error);
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

app.use(fileUpload());

app.use("/", pagesRouter);
app.use(
  "/api",
  new ApiRouter("mongodb/authors", new MongooseModelRepository(mongooseAuthor))
    .routes,
);
app.use(
  "/api",
  new ApiRouter("mongodb/books", new MongooseModelRepository(mongooseBook))
    .routes,
);
app.use(
  "/api",
  new ApiRouter("mongodb/copies", new MongooseModelRepository(mongooseCopy))
    .routes,
);
app.use(
  "/api",
  new ApiRouter("mongodb/genres", new MongooseModelRepository(mongooseGenre))
    .routes,
);
app.use(
  "/api",
  new ApiRouter(
    "mariadb/authors",
    new SequelizeModelRepository(SequelizeAuthor),
  ).routes,
);
app.use(
  "/api",
  new ApiRouter("mariadb/books", new SequelizeModelRepository(SequelizeBook))
    .routes,
);
app.use(
  "/api",
  new ApiRouter("mariadb/copies", new SequelizeModelRepository(SequelizeCopy))
    .routes,
);
app.use(
  "/api",
  new ApiRouter("mariadb/genres", new SequelizeModelRepository(SequelizeGenre))
    .routes,
);

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
