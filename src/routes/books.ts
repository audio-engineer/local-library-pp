import { Router } from "express";
import {
  bookCreateGet,
  bookDeleteGet,
  bookDeletePost,
  getBookById,
  getBooks,
} from "../controllers/books.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.get("/books/create", bookCreateGet);
router.get("/books/:id/delete", bookDeleteGet);
router.post("/books/:id/delete", bookDeletePost);
router.get("/books/:id/copies", getBookById);

export default router;
