"use strict";

import * as async from "async";
import { Response, Request, NextFunction, Router } from "express";

const db = require("../db-mocks.json");

/**
 * GET /api
 * List of API examples.
 */
const router = Router();

// HOME

router.get("/", (req: Request, res: Response) => {
    res.json();
});

// TALKS

router.get("/talks", (req: Request, res: Response) => {
    const err = db.talks ? false : true;
    if (err) res.status(404).send("Talks not found");
    res.status(200).send(db.talks);
});

export default router;
