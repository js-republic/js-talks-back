import * as _ from "lodash";
import * as mysql from "mysql";

import { Talk, User, Duration, Kind, AddTalkParams } from "../types";
import { select, sql, update, remove, snakeCaseKeys } from "../database";


// TALKS
export async function addTalk(addTalkParams: AddTalkParams): Promise<number> {
  const speakersIdsList = addTalkParams.speakers;
  delete addTalkParams.speakers;

  const talkToInsert = snakeCaseKeys(addTalkParams);
  return await update(sql`INSERT INTO talks SET ${talkToInsert}`);
}

export async function findTalks(): Promise<Talk[]> {
  const { rows } = await select(sql`SELECT
      t.talk_id,
      t.title,
      t.kind,
      t.duration,
      t.scheduled_at,
      t.description,
      t.is_active,
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
      t.is_active,
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

// LIKES
export async function addLike(talkId: number, userId: number): Promise<number> {
  const like = {
    user_id: userId,
    talk_id: talkId
  }
  return await update(sql`INSERT INTO likes SET ${like}`)
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

export async function removeLike(talkId: number, userId: number): Promise<number> {
  return await remove(sql`DELETE FROM likes WHERE user_id = ${userId} AND talk_id = ${talkId}`)
}

// SPEAKERS
export async function addSpeakers(talkId: number, speakersIdsList: Array<number>): Promise<number> {
  let speakersIds = [] as Array<any>
  speakersIdsList.map((userId: number) => speakersIds.push([userId, talkId]))

  return await update(sql`INSERT INTO speakers (user_id, talk_id) VALUES ${speakersIds}`);
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
  `);
  return rows.map((row: any): User => row as User);
}

export async function findUserByMail(email: string): Promise<any> {
  const { rows } = await select(sql`
    SELECT
      u.user_id,
      u.email,
      GROUP_CONCAT(DISTINCT(t.talk_id)) as author,
      GROUP_CONCAT(DISTINCT(s.talk_id)) as speaker,
      GROUP_CONCAT(DISTINCT(l.talk_id)) as ulike
    FROM users u
        JOIN talks t ON u.user_id = t.author_id
        JOIN speakers s ON u.user_id = s.user_id
        JOIN likes l ON u.user_id = l.user_id
    WHERE u.email = ${email}
    GROUP BY u.user_id
  `);

  return rows.map((row: any): object => {
    return {
      user_id: row.user_id,
      email: row.email,
      talks_ids: {
        talks: transformToIntArray(row.author),
        speakers: transformToIntArray(row.speaker),
        likes: transformToIntArray(row.ulike)
      }
    }
  })
}

const transformToIntArray = (list: string): Array<number> => {
  return list.split(',').map(id => parseInt(id))
}
