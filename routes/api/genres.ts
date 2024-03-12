import { Router } from "express";
import {
  deleteAll,
  deleteById,
  getAll,
  getById,
  save,
  updateBook,
} from "@/controllers/api/genres.js";

const router = Router();

router.get("/v1/genres", getAll);
router.post("/v1/genres", save);
router.delete("/v1/genres", deleteAll);

router.get("/v1/genres/:id", getById);
router.put("/v1/genres/:id", updateBook);
router.delete("/v1/genres/:id", deleteById);

export default router;
