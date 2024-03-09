import { Router } from "express";
import {
  bookCreateGet,
  bookCreatePost,
  bookDeleteGet,
  bookDeletePost,
  bookDetail,
  bookIndex,
  bookList,
  bookUpdateGet,
  bookUpdatePost,
} from "@/controllers/books.js";
import {
  authorCreateGet,
  authorCreatePost,
  authorDeleteGet,
  authorDeletePost,
  authorDetail,
  authorList,
  authorUpdateGet,
  authorUpdatePost,
} from "@/controllers/authors.js";
import {
  genreCreateGet,
  genreCreatePost,
  genreDeleteGet,
  genreDeletePost,
  genreDetail,
  genreList,
  genreUpdateGet,
  genreUpdatePost,
} from "@/controllers/genres.js";
import {
  bookInstanceCreateGet,
  bookInstanceCreatePost,
  bookInstanceDeleteGet,
  bookInstanceDeletePost,
  bookInstanceDetail,
  bookInstanceList,
  bookInstanceUpdateGet,
  bookInstanceUpdatePost,
} from "@/controllers/copies.js";

const router = Router();

router.get("/", bookIndex);

router.get("/books", bookList);
router.get("/books/create", bookCreateGet);
router.post("/books/create", bookCreatePost);
router.get("/books/:id/delete", bookDeleteGet);
router.post("/books/:id/delete", bookDeletePost);
router.put("/books/:id/update", bookUpdateGet);
router.post("/books/:id/update", bookUpdatePost);
router.get("/books/:id", bookDetail);
router.get("/books/:id/copies", bookDetail);

router.get("/authors", authorList);
router.get("/author/create", authorCreateGet);
router.post("/author/create", authorCreatePost);
router.get("/author/:id/delete", authorDeleteGet);
router.post("/author/:id/delete", authorDeletePost);
router.get("/author/:id/update", authorUpdateGet);
router.post("/author/:id/update", authorUpdatePost);
router.get("/author/:id", authorDetail);

router.get("/genres", genreList);
router.get("/genre/create", genreCreateGet);
router.post("/genre/create", genreCreatePost);
router.get("/genre/:id/delete", genreDeleteGet);
router.post("/genre/:id/delete", genreDeletePost);
router.get("/genre/:id/update", genreUpdateGet);
router.post("/genre/:id/update", genreUpdatePost);
router.get("/genre/:id", genreDetail);

router.get("/copies/:id", bookInstanceList);
router.get("/book-instance/create", bookInstanceCreateGet);
router.post("/book-instance/create", bookInstanceCreatePost);
router.get("/book-instance/:id/delete", bookInstanceDeleteGet);
router.post("/book-instance/:id/delete", bookInstanceDeletePost);
router.get("/book-instance/:id/update", bookInstanceUpdateGet);
router.post("/book-instance/:id/update", bookInstanceUpdatePost);
router.get("/book-instance/:id", bookInstanceDetail);

export default router;
