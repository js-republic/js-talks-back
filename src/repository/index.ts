import * as _ from "lodash";
import * as mysql from "mysql";

import { Talk, User, Duration, Kind, AddTalkParams } from "../types";
import { select, sql, update, snakeCaseKeys } from "../database";

export async function addTalk(addTalkParams: AddTalkParams): Promise<number> {

  const speakersIdsList = addTalkParams.speakers
  delete addTalkParams.speakers

  const talkToInsert = snakeCaseKeys(addTalkParams);
  let talkId = await update(sql`INSERT INTO talks SET ${talkToInsert}`);
      talkId = talkId as number

  let speakersIds = [] as Array<any>
  speakersIdsList.map((userId: number) => speakersIds.push([userId, talkId]))

  addSpeakers(speakersIds);

  return talkId
}

export async function addSpeakers(speakersId: Array<number>): Promise<number> {
  return await update(sql`INSERT INTO speakers (user_id, talk_id) VALUES ${speakersId}`);
}

export async function updateTalk(talkId: number, talk: Talk): Promise<number> {
  return await update(sql`
    UPDATE talks SET ${talk} WHERE talk_id = ${talkId}
  `)
}

export async function removeTalks(talkId: number): Promise<number> {
  return await update(sql`
    UPDATE talks SET is_active = 0 WHERE talk_id = ${talkId}
  `)
}

export async function findLikesByTalkId(talkId: number): Promise<User[]> {
  const { rows } = await select(sql`
    SELECT
      users.user_id,
      users.email
    FROM likes l
    JOIN users ON l.user_id = users.user_id
    JOIN talks t ON t.talk_id = l.talk_id
    WHERE l.talk_id = ${talkId} AND t.is_active = 1
  `);
  return rows.map((row: any): User => row as User);
}

export async function findSpeakersByTalkId(talkId: number): Promise<User[]> {
  const { rows } = await select(sql`
    SELECT
      DISTINCT(users.user_id),
      users.email
    FROM users
    JOIN speakers s ON users.user_id = s.user_id
    JOIN talks t ON t.author_id = users.user_id
    WHERE s.talk_id = ${talkId}
    AND t.is_active = 1
  `);
  return rows.map((row: any): User => row as User);
}

export async function findTalks(): Promise<Talk[]> {
  const { rows } = await select(sql`SELECT
      t.talk_id,
      t.title,
      t.kind,
      t.duration,
      t.scheduled_at,
      t.description,
      u.user_id,
      u.email
    FROM talks t
    JOIN users u ON t.author_id = u.user_id
    WHERE t.is_active = 1
  `);

  return Promise.all(rows.map(async (row: any): Promise<Talk> => {
    const talkId = row.talk_id as number;
    return {
      talk_id: talkId,
      author: {
        id: row.author_id as number,
        email: row.email as string
      },
      title: row.title as string,
      kind: row.kind as Kind,
      duration: row.duration as Duration,
      scheduledAt: row.scheduled_at as Date,
      description: row.description as string,
      likes: await findLikesByTalkId(talkId),
      speakers: await findSpeakersByTalkId(talkId)
    };
  }));
}

export async function findTalksById(talkId: number): Promise<Talk[]> {
  const { rows } = await select(sql`
    SELECT
      t.talk_id,
      t.title,
      t.kind,
      t.duration,
      t.scheduled_at,
      t.description,
      u.user_id,
      u.email
    FROM talks t
    JOIN users u ON t.author_id = u.user_id
    WHERE t.talk_id = ${talkId} AND t.is_active = 1
  `);

  return Promise.all(rows.map(async (row: any): Promise<Talk> => {
    return {
      talk_id: talkId,
      author: {
        id: row.author_id as number,
        email: row.email as string
      },
      title: row.title as string,
      kind: row.kind as Kind,
      duration: row.duration as Duration,
      scheduledAt: row.scheduled_at as Date,
      description: row.description as string,
      likes: await findLikesByTalkId(talkId),
      speakers: await findSpeakersByTalkId(talkId)
    }
  }));
}

