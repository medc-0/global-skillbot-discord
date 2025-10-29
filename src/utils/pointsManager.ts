import { readUsers, writeUsers } from "./fileHandler.js";

export async function addXP(userId: string, amount: number): Promise<any> {
    const users = await readUsers();
    const today = new Date().toDateString();

    if (!users[userId]) {
        users[userId] = { xp: 0, streak: 0, lastActive: null };
    }

    const user = users[userId];

    // handle streaks
    if (user.lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        user.streak = user.lastActive === yesterday ? user.streak + 1 : 1;
        user.lastActive = today;
    }

    // add XP
    user.xp += amount;

    await writeUsers(users);
    return user;
}

export async function getUser(userId: string): Promise<any> {
    const users = await readUsers();
    return users[userId] || { xp: 0, streak: 0, lastActive: null };
}
