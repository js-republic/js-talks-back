import * as _ from "lodash";
import { Talk, User, Duration, Kind } from "../types";
import * as mysql from "mysql";
import { select, sql, update, snakeCaseKeys } from "../database";

interface AddTalkParams {
  description: string;
  kind: Kind;
  authorId: number;
  duration: Duration;
  title: string;
  scheduledAt?: Date;
}

export async function addTalk(addTalkParams: AddTalkParams): Promise<number> {
  const talkToInsert = snakeCaseKeys(addTalkParams);
  return await update(sql`insert into talk set ${talkToInsert}`);
}

export async function findLikesByTalkId(talkId: number): Promise<User[]> {
  const { rows } = await select(sql`
    select user.id, user.email
    from \`like\` l
    join user on l.user=user.id
    where l.talk=${talkId}
  `);
  return rows.map((row: any): User => row as User);
}

export async function findSpeakersByTalkId(talkId: number): Promise<User[]> {
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
    select
      t.id as talk_id,
      t.title,
      t.kind,
      t.duration,
      t.scheduled_at,
      t.description,
      u.id as author_id,
      u.email
    from talk t
    join user u on u.id=t.author
  `);
  return Promise.all(rows.map(async (row: any): Promise<Talk> => {
    const talkId = row.talk_id as number;
    return {
      id: talkId,
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