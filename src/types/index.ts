export interface Lesson {
    topic: string;
    content: string;
    createdBy: string;
    createdAt: Date;
}

export interface LessonDatabase {
    [topic: string]: Lesson[];
}

export interface UserData {
    id: string;
    xp: number;
    lastLearnTime?: Date;
    streak: number;
    topics: string[];
}

export interface UserDatabase {
    [userId: string]: UserData;
}