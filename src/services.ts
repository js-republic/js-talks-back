import * as _ from "lodash";
import { Talk, User, Duration, Kind } from "./models";
import * as mysql from "mysql";
import { select, sql, update } from "./utils/database-helpers";

export async function insertTalk(talk: Talk): Promise<Talk> {
  const talkToInsert =
    _.mapKeys(talk, (value: any, key: string) => _.snakeCase(key));
  const id = await update(sql`insert into talk set ${talkToInsert}`);
  return {...talk, id};
}

export async function findLikesByTalkId(talkId: string): Promise<User[]> {
  const { rows } = await select(sql`
    select user.id, user.email
    from like
    join user on like.user=user.id
    where like.talk = ${talkId}
  `);
  return rows.map((row: any): User => row as User);
}

export async function findSpeakersByTalkId(talkId: string): Promise<User[]> {
  const { rows } = await select(sql`
    select user.id, user.email
    from speak
    join user on speak.user=user.id
    where speak.talk = ${talkId}
  `);
  return rows.map((row: any): User => row as User);
}

export async function findTalks(): Promise<Talk[]> {
  const { rows } = await select(sql`
    select *
    from talk t
    join user u on u.id=t.author
  `);

  return Promise.all(rows.map(async (row: any): Promise<Talk> => {
    const talkId = row.id as string;
    return {
      id: talkId,
      author: row.u as User,
      title: row.title as string,
      kind: row.kind as Kind,
      duration: row.duration as Duration,
      scheduled: row.scheduled_at as Date,
      description: row.description as string,
      likes: await findLikesByTalkId(talkId),
      speakers: await findSpeakersByTalkId(talkId)
    };
  }));
}