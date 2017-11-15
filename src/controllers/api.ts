"use strict";

import * as async from "async";
import { Response, Request, NextFunction, Router } from "express";

/**
 * GET /api
 * List of API examples.
 */
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ name: "JS-Talks API" });
});
export default router;
