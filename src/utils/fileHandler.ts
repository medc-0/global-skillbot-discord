import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import type { LessonDatabase, UserDatabase } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Store data under src/data so it works in dev with tsx
const DATA_DIR = path.join(__dirname, "../data");
const LESSONS_FILE = path.join(DATA_DIR, "lessons.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureDataDir() {
  await fs.ensureDir(DATA_DIR);
}

export async function readLessons(): Promise<LessonDatabase> {
  try {
    await ensureDataDir();
    if (!(await fs.pathExists(LESSONS_FILE))) {
      await fs.writeJson(LESSONS_FILE, {});
    }
    return await fs.readJson(LESSONS_FILE);
  } catch (err) {
    console.error("Error reading lessons file:", err);
    return {};
  }
}

export async function writeLessons(data: LessonDatabase): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeJson(LESSONS_FILE, data, { spaces: 2 });
  } catch (err) {
    console.error("Error writing lessons file:", err);
    throw err;
  }
}

export async function readUsers(): Promise<UserDatabase> {
  try {
    await ensureDataDir();
    if (!(await fs.pathExists(USERS_FILE))) {
      await fs.writeJson(USERS_FILE, {});
    }
    return await fs.readJson(USERS_FILE);
  } catch (err) {
    console.error("Error reading users file:", err);
    return {};
  }
}

export async function writeUsers(data: UserDatabase): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeJson(USERS_FILE, data, { spaces: 2 });
  } catch (err) {
    console.error("Error writing users file:", err);
    throw err;
  }
}
