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
    removeLike,
    hasAlreadyLiked
} from "./../requests"

export const home = (req: Request, res: Response) => {
    res.json('/')
}

export const postTalk_ = (req: Request, res: Response) => {
    const talk = req.body
    const hasSpeakers = talk.speakers && talk.speakers.length > 1
    addTalk(talk)
        .then<any[]>(talkId => {
            if (hasSpeakers) {
                return Promise.all([talkId, addSpeakers(talkId, talk.speakers)])
            } else {
                return [talkId]
            }
        })
        .then(([talkId]) => findTalksById(talkId))
        .then(datas => res.status(200).json(datas))
        .catch(error => res.status(400).json({ error }))
}

export const postTalk = async (req: Request, res: Response) => {
    const talk = req.body
    const hasSpeakers = talk.speakers && talk.speakers.length > 1
    try {
        const talkId = await addTalk(talk)
        if (hasSpeakers) {
            await addSpeakers(talkId, talk.speakers)
        }
        const datas = await findTalksById(talkId)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const getTalks = async (req: Request, res: Response) => {
    try {
        const datas = await findTalks()
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const getTalkById = async (req: Request, res: Response) => {
    const talkId = req.params.talk_id
    try {
        const datas = await findTalksById(talkId)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const editTalkById = async (req: Request, res: Response) => {
    const talk_id = req.params.talk_id as number
    const talk = req.body
    try {
        await updateTalk(talk_id, talk)
        const datas = await findLikesByTalkId(talk_id)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const deleteTalk = async (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    try {
        await removeTalks(talk_id)
        res.status(200)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const postLike = async (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    const user_id = req.body.user_id
    try {
        const datas = await addLike(talk_id, user_id)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const getLike = async (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    try {
        const datas = await findLikesByTalkId(talk_id)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const deleteLike = async (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    const user_id = req.body.user_id
    try {
        await removeLike(talk_id, user_id)
        res.status(200)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const getSpeakers = async (req: Request, res: Response) => {
    const talk_id = req.params.talk_id
    try {
        const datas = await findSpeakersByTalkId(talk_id)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}

export const getUsers = async (req: Request, res: Response) => {
    const email = req.headers.email as string
    try {
        const datas = await findUserByMail(email)
        res.status(200).json(datas)
    } catch (error) {
        res.status(400).json({error})
    }
}
