import type { Request, Response } from "express";
import { Router } from "express";

export default Router().get(
  "/",
  (req: Readonly<Request>, res: Readonly<Response>) => {
    res.redirect("/catalog");
  },
);
