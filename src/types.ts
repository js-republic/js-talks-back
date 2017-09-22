export interface User {
    id: number;

    email: string;
}


export type Kind = "request" | "proposal";

export type Duration = "30" | "60" | "180";

export interface Talk {
    id?: number;

    author: User;

    duration: Duration;

    title: string;

    description: string;

    kind: Kind;

    scheduledAt?: Date;

    likes: User[];

    speakers: User[];
}