import { Router } from "express";
import {
  authorCreateGet,
  authorCreatePost,
  authorDeleteGet,
  authorDeletePost,
  authorDetail,
  authorList,
  authorUpdateGet,
  authorUpdatePost,
} from "../controllers/authors.js";

const router = Router();

router.get("/authors", authorList);
router.get("/authors/:id", authorDetail);
router.get("/authors/create", authorCreateGet);
router.post("/authors/create", authorCreatePost);
router.get("/authors/:id/delete", authorDeleteGet);
router.post("/authors/:id/delete", authorDeletePost);
router.get("/author/:id/update", authorUpdateGet);
router.post("/authors/:id/update", authorUpdatePost);

export default router;
