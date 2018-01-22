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
