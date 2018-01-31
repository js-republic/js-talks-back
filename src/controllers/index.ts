import { Response, Request, Router } from "express";
import {
    findTalks,
    findTalksById,
    findLikesByTalkId,
    findSpeakersByTalkId,
    findUserByMail,
    addTalk,
    addLike,
    addSpeakers,
    updateTalk,
    removeTalks,
    removeLike
} from "./../requests"

const router = Router()

export const home = (req: Request, res: Response) => {
    res.json('/')
}

export const postTalk = (req: Request, res: Response) => {
    const talk = req.body
    const speakers = req.body.speakers
    addTalk(talk)
    .then(talkId => {
        if (speakers && speakers.length > 1) {
            addSpeakers(talkId, speakers)
            .then(datas => {
                findTalksById(talkId)
                .then(datas => res.status(200).json(datas))
                .catch(error => res.status(400).json({ error }))
            })
            .catch(error => res.status(400).json({ error }))
        } else {
            findTalksById(talkId)
            .then(datas => res.status(200).json(datas))
            .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
}

export const getTalks = (req: Request, res: Response) => {
    findTalks()
    .then(datas => res.status(200).json(datas))
    .catch(error => res.status(400).json({ error }))
}

export const getTalkById = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    findTalksById(talk_id)
    .then(datas => res.status(200).json(datas))
    .catch(error => res.status(400).json({ error }))
}

export const editTalkById = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id as number
    const talk = req.body
    updateTalk(talk_id, talk)
    .then(datas => {
        findTalksById(talk_id)
        .then(datas => res.status(200).json(datas))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
}

export const deleteTalk = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    removeTalks(talk_id)
    .then(result => res.status(200))
    .catch(error => res.status(400).json({ error }))
}

export const postLike = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    const user_id = req.body.user_id
    addLike(talk_id, user_id)
    .then(datas => res.status(200).json(datas))
    .catch(error => res.status(400).json({ error }))
}

export const getLike = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    findLikesByTalkId(talk_id)
    .then(datas => res.status(200).json(datas))
    .catch(error => res.status(400).json({ error }))
}

export const deleteLike = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    const user_id = req.body.user_id
    removeLike(talk_id, user_id)
    .then(datas => res.status(200))
    .catch(error => res.status(400).json({ error }))
}

export const getSpeakers = (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    findSpeakersByTalkId(talk_id)
    .then(datas => res.status(200).json(datas))
    .catch(error => res.status(400).json({ error }))
}

export const getUsers = (req: Request, res: Response) => {
    const email = req.headers.email as string
    findUserByMail(email)
    .then(datas => res.status(200).json(datas))
    .catch(error => res.status(400).json({ error }))
}

export default router;
