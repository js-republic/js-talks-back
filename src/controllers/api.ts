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
    addLike,
    addSpeakers,
    removeLike,
    findUserByMail
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
router.post("/talks", (req: Request, res: Response) => {
    const talk = req.body
    const speakers = req.body.speakers
    addTalk(talk).then(talkId => {
        if (speakers && speakers.length > 1) {
            addSpeakers(talkId, speakers).then(datas => {
                findTalksById(talkId).then(datas => res.status(200).json(datas))
            })
        } else {
            findTalksById(talkId).then(datas => res.status(200).json(datas))
        }
    });
});

router.get("/talks", (req: Request, res: Response) => {
    findTalks().then(datas => res.status(200).json(datas))
});

router.get("/talks/:talk_id", (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    findTalksById(talk_id).then(datas => res.status(200).json(datas))
});

router.put("/talks/:talk_id", (req: Request, res: Response) => {
    const talk_id = req.params.talk_id as number
    const talk = req.body
    updateTalk(talk_id, talk).then(datas => {
        findTalksById(talk_id).then(datas => res.status(200).json(datas))
    });
});

router.delete("/talks/:talk_id", (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    removeTalks(talk_id).then(result => res.status(200))
});

// LIKES
router.post("/talks/:talk_id/likes", (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    const user_id = req.body.user_id
    addLike(talk_id, user_id).then(datas => res.status(200).json(datas))
});

router.get("/talks/:talk_id/likes", (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    findLikesByTalkId(talk_id).then(datas => res.status(200).json(datas))
});

router.delete("/talks/:talk_id/likes", (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    const user_id = req.body.user_id
    removeLike(talk_id, user_id).then(datas => res.status(200))
});

// SPEAKERS
router.get('/talks/:talk_id/speakers', (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    findSpeakersByTalkId(talk_id).then(datas => res.status(200).json(datas))
});

// USERS
router.get('/users', (req: Request, res: Response) => {
    const email = req.headers.email as string
    findUserByMail(email).then(datas => res.json(datas))
});

export default router;
