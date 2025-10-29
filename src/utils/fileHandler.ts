import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lessonsPath = path.join(__dirname, "../data/lessons.json");
const usersPath = path.join(__dirname, "../data/users.json");

export async function readLessons(): Promise<Record<string, string[]>> {
  try {
    const data = await fs.readFile(lessonsPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function writeLessons(data: Record<string, string[]>): Promise<void> {
  await fs.writeFile(lessonsPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readUsers(): Promise<Record<string, any>> {
  try {
    const data = await fs.readFile(usersPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export async function writeUsers(data: Record<string, any>): Promise<void> {
  await fs.writeFile(usersPath, JSON.stringify(data, null, 2), "utf-8");
}
