import { Router } from "express";
import {
  deleteDeleteAuthor,
  getAuthorById,
  getAuthors,
  getCreateAuthor,
  getDeleteAuthor,
  getUpdateAuthor,
  patchUpdateAuthor,
  postCreateAuthor,
} from "../controllers/authors.js";
import {
  deleteDeleteBook,
  getBookById,
  getBooks,
  getCreateBook,
  getDeleteBook,
} from "../controllers/books.js";
import {
  deleteDeleteCopy,
  getCopies,
  getCopyById,
  getCreateCopy,
  getDeleteCopy,
  getUpdateCopy,
  patchUpdateCopy,
  postCreateCopy,
} from "../controllers/copies.js";
import {
  deleteDeleteGenre,
  getCreateGenre,
  getDeleteGenre,
  getGenreById,
  getGenres,
  getUpdateGenre,
  patchUpdateGenre,
  postCreateGenre,
} from "../controllers/genres.js";
import { index } from "../controllers/index.js";

const pagesRouter = Router();

pagesRouter.get("/", index);

/**
 * Author pages
 */
pagesRouter.get("/authors", getAuthors);
pagesRouter.get("/authors/:id", getAuthorById);
pagesRouter.get("/authors/create", getCreateAuthor);
pagesRouter.get("/author/:id/update", getUpdateAuthor);
pagesRouter.get("/authors/:id/delete", getDeleteAuthor);

/**
 * Author actions
 */
pagesRouter.post("/authors/create", postCreateAuthor);
pagesRouter.patch("/authors/:id/update", patchUpdateAuthor);
pagesRouter.delete("/authors/:id/delete", deleteDeleteAuthor);

/**
 * Book pages
 */
pagesRouter.get("/books", getBooks);
pagesRouter.get("/books/:id", getBookById);
pagesRouter.get("/books/create", getCreateBook);
pagesRouter.get("/books/:id/delete", getDeleteBook);
// pagesRouter.get("/books/:id/copies", getCopiesByBookId);

/**
 * Book actions
 */
// pagesRouter.post("/books/create", postCreateBook);
// pagesRouter.patch("/books/:id/update", patchUpdateBook);
pagesRouter.delete("/books/:id/delete", deleteDeleteBook);

/**
 * Copy pages
 */
pagesRouter.get("/copies", getCopies);
pagesRouter.get("/copies/:id", getCopyById);
pagesRouter.get("/copies/create", getCreateCopy);
pagesRouter.get("/copies/:id/update", getUpdateCopy);
pagesRouter.get("/copies/:id/delete", getDeleteCopy);

/**
 * Copy actions
 */
pagesRouter.post("/copies/create", postCreateCopy);
pagesRouter.patch("/copies/:id/update", patchUpdateCopy);
pagesRouter.delete("/copies/:id/delete", deleteDeleteCopy);

/**
 * Genre pages
 */
pagesRouter.get("/genres", getGenres);
pagesRouter.get("/genres/:id", getGenreById);
pagesRouter.get("/genres/create", getCreateGenre);
pagesRouter.get("/genres/:id/update", getUpdateGenre);
pagesRouter.get("/genres/:id/delete", getDeleteGenre);

/**
 * Genre actions
 */
pagesRouter.post("/genres/create", postCreateGenre);
pagesRouter.patch("/genres/:id/update", patchUpdateGenre);
pagesRouter.delete("/genres/:id/delete", deleteDeleteGenre);

export { pagesRouter };
