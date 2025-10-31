import type { UserData, UserDatabase } from "../types";
import { readUsers, writeUsers } from "./fileHandler";

const XP_PER_LESSON = 10;
const XP_PER_TEACH = 20;
const STREAK_BONUS = 5;
const MS_IN_DAY = 24 * 60 * 60 * 1000;

export async function getUser(userId: string): Promise<UserData> {
  const users = await readUsers();
  if (!users[userId]) {
    users[userId] = {
      id: userId,
      xp: 0,
      streak: 0,
      topics: []
    };
    await writeUsers(users);
  }
  return users[userId];
}

export async function addXP(userId: string, amount: number, action: 'learn' | 'teach'): Promise<UserData> {
  const users = await readUsers();
  const user = users[userId] || {
    id: userId,
    xp: 0,
    streak: 0,
    topics: []
  };

  const now = new Date();
  const lastLearn = user.lastLearnTime ? new Date(user.lastLearnTime) : null;

  // Update streak
  if (lastLearn) {
    const daysSinceLastLearn = Math.floor((now.getTime() - lastLearn.getTime()) / MS_IN_DAY);
    if (daysSinceLastLearn === 1) {
      user.streak += 1;
      amount += STREAK_BONUS * user.streak; // Bonus XP for maintaining streak
    } else if (daysSinceLastLearn > 1) {
      user.streak = 1;
    }
  } else {
    user.streak = 1;
  }

  if (!amount || amount < 0) {
    amount = action === 'teach' ? XP_PER_TEACH : XP_PER_LESSON;
  }
  user.xp += amount;
  user.lastLearnTime = now;

  users[userId] = user;
  await writeUsers(users);
  return user;
}

export async function getLeaderboard(): Promise<UserData[]> {
  const users = await readUsers();
  return Object.values(users)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);
}

export function calculateLevel(xp: number): number {
  const base = Math.floor(Math.sqrt(xp / 100)) + 1;
  return Math.max(1, base);
}

export function calculateNextLevelXP(level: number): number {
  return (level + 1) * (level + 1) * 100;
}

export function calculateLevelProgress(xp: number) {
  const level = calculateLevel(xp);
  const prevLevelTotal = (level - 1) * (level - 1) * 100;
  const nextLevelTotal = level * level * 100;
  const currentInLevel = Math.max(0, xp - prevLevelTotal);
  const neededForLevel = Math.max(1, nextLevelTotal - prevLevelTotal);
  const remaining = Math.max(0, nextLevelTotal - xp);
  const percent = Math.min(100, Math.floor((currentInLevel / neededForLevel) * 100));
  return { level, currentInLevel, neededForLevel, remaining, percent };
}
