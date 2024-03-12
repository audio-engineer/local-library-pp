import { Router } from "express";
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

const router = Router();

router.get("/genres", genreList);
router.get("/genres/create", genreCreateGet);
router.post("/genres/create", genreCreatePost);
router.get("/genres/:id/delete", genreDeleteGet);
router.post("/genres/:id/delete", genreDeletePost);
router.get("/genres/:id/update", genreUpdateGet);
router.post("/genres/:id/update", genreUpdatePost);
router.get("/genres/:id", genreDetail);

export default router;
