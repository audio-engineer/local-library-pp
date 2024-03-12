import { Router } from "express";
import {
  deleteAll,
  deleteById,
  getAll,
  getById,
  save,
  updateBook,
} from "@/controllers/api/copies.js";

const router = Router();

router.get("/v1/copies", getAll);
router.post("/v1/copies", save);
router.delete("/v1/copies", deleteAll);

router.get("/v1/copies/:id", getById);
router.put("/v1/copies/:id", updateBook);
router.delete("/v1/copies/:id", deleteById);

export default router;
