"use strict";

import * as async from "async";
import { Response, Request, NextFunction, Router } from "express";
import { initDatabase, select } from "./../database"
import {
    findTalks,
    findTalksById,
    findLikesByTalkId,
    findSpeakersByTalkId,
    addTalk,
    updateTalk,
    removeTalks,
} from "./../repository"


/**
 * GET /api
 * List of API examples.
 */
const router = Router();

// HOME
router.get("/", (req: Request, res: Response) => {
    res.json("/");
});

// TALKS
router.get("/talks", (req: Request, res: Response) => {
    findTalks().then(datas => res.status(200).json(datas))
});

router.get("/talks/:talk_id", (req: Request, res: Response) => {
    const talk_id = parseInt(req.param('talk_id'))
    findTalksById(talk_id).then(datas => res.status(200).json(datas))
});

router.get("/talks/:talk_id/likes", (req: Request, res: Response) => {
    const talk_id = parseInt(req.param('talk_id'))
    findLikesByTalkId(talk_id).then(datas => res.status(200).json(datas))
});

router.get('/talks/:talk_id/speakers', (req: Request, res: Response) => {
    const talk_id = parseInt(req.param('talk_id'))
    findSpeakersByTalkId(talk_id).then(datas => res.status(200).json(datas))
});

// Add talk
router.post("/talks", (req: Request, res: Response) => {
    const talk = req.body
    addTalk(talk).then(talkId => res.status(200).json({talk_id: talkId}))
});

// Update talk
router.put("/talks/:talk_id", (req: Request, res: Repsonse) => {
    const talk_id = req.param('talk_id')
    const talk = req.body
    updateTalk(talk_id, talk).then(datas => res.status(200).json(datas))
});

// Delete talk
router.delete("/talks/:talk_id", (req: Request, res: Response) => {
    const talk_id = req.param('talk_id')
    removeTalks(talk_id).then(result => res.status(200))
});

export default router;
