export interface SqlQuery {
    query: string;
    params: any[];
}

export interface SelectResult {
    rows: any[];
    fields: any[];
}

export interface Commands {
    select: (sql: SqlQuery) => Promise<SelectResult>;
    update: (sql: SqlQuery) => Promise<number>;
    remove: (sql: SqlQuery) => Promise<any>;
}

export interface User {
    id: number;
    email: string;
}

export type Kind = "request" | "proposal";

export type Duration = "30" | "60" | "180";

export interface Talk {
    talk_id?: number;
    author: User;
    duration: Duration;
    title: string;
    description: string;
    kind: Kind;
    is_active?: number;
    scheduledAt?: Date;
    likes: User[];
    speakers: User[];
}

export interface AddTalkParams {
    description: string;
    kind: Kind;
    authorId: number;
    duration: Duration;
    title: string;
    scheduledAt?: Date;
    speakers?: Array<number>;
}
