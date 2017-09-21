export interface User {
    id: string;

    email: string;
}

export interface Talk {
    id: string;

    author: User;

    duration: 30 | 60 | 180;

    title: string;

    description: string;

    kind: "request" | "proposal";

    scheduled?: Date;

    likes: User[];

    speakers: User[];
}