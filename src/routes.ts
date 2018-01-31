import { Router } from "express";
import {
  home,
  postTalk,
  getTalks,
  getTalkById,
  editTalkById,
  deleteTalk,
  postLike,
  getLike,
  deleteLike,
  getSpeakers,
  getUsers
} from './controllers'

const router = Router();

router.get("/", home);

router.post("/talks", postTalk);

router.get("/talks", getTalks);

router.get("/talks/:talk_id", getTalkById);

router.put("/talks/:talk_id", editTalkById);

router.delete("/talks/:talk_id", deleteTalk);

router.post("/talks/:talk_id/likes", postLike);

router.get("/talks/:talk_id/likes", getLike);

router.delete("/talks/:talk_id/likes", deleteLike);

router.get('/talks/:talk_id/speakers', getSpeakers);

router.get('/users', getUsers);

export default router;
