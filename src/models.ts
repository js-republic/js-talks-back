export interface User {
    id: string;

    email: string;
}


export type Kind = "request" | "proposal";

export type Duration = 30 | 60 | 180;

export interface Talk {
    id: string;

    author: User;

    duration: Duration;

    title: string;

    description: string;

    kind: Kind;

    scheduled?: Date;

    likes: User[];

    speakers: User[];
}