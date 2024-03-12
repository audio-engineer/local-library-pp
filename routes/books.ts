import { Router } from "express";
import {
  bookCreateGet,
  bookCreatePost,
  bookDeleteGet,
  bookDeletePost,
  bookUpdateGet,
  bookUpdatePost,
  getBookById,
  getBooks,
} from "@/controllers/books.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.get("/books/create", bookCreateGet);
router.post("/books/create", bookCreatePost);
router.get("/books/:id/delete", bookDeleteGet);
router.post("/books/:id/delete", bookDeletePost);
router.put("/books/:id/update", bookUpdateGet);
router.post("/books/:id/update", bookUpdatePost);
router.get("/books/:id/copies", getBookById);

export default router;
