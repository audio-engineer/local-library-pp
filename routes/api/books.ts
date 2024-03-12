import { Router } from "express";
import {
  deleteAll,
  deleteById,
  getAll,
  getById,
  save,
  updateBook,
} from "@/controllers/api/books.js";

const router = Router();

router.get("/v1/books", getAll);
router.post("/v1/books", save);
router.delete("/v1/books", deleteAll);

router.get("/v1/books/:id", getById);
router.put("/v1/books/:id", updateBook);
router.delete("/v1/books/:id", deleteById);

export default router;
