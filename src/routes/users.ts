import type { Request, Response } from "express";
import { Router } from "express";

export default Router().get("/", (req: Request, res: Response) => {
  res.send("respond with a resource");
});
