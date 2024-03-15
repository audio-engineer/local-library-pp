import { Router } from "express";
import {
  bookInstanceCreateGet,
  bookInstanceCreatePost,
  bookInstanceDeleteGet,
  bookInstanceDeletePost,
  bookInstanceDetail,
  bookInstanceList,
  bookInstanceUpdateGet,
  bookInstanceUpdatePost,
} from "../controllers/copies.js";

const router = Router();

router.get("/copies", bookInstanceList);
router.get("/copies/create", bookInstanceCreateGet);
router.post("/copies/create", bookInstanceCreatePost);
router.get("/copies/:id/delete", bookInstanceDeleteGet);
router.post("/copies/:id/delete", bookInstanceDeletePost);
router.get("/copies/:id/update", bookInstanceUpdateGet);
router.post("/copies/:id/update", bookInstanceUpdatePost);
router.get("/copies/:id", bookInstanceDetail);

export default router;
