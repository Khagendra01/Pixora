import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const usersPath = path.join(dataDirectory, "users.json");

async function ensureDataDirectory() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

export async function readUsers(): Promise<UserRecord[]> {
  try {
    const file = await fs.readFile(usersPath, "utf-8");
    const parsed = JSON.parse(file) as UserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeUsers(users: UserRecord[]): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(usersPath, `${JSON.stringify(users, null, 2)}\n`, "utf-8");
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function createUser({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) {
  const users = await readUsers();
  const record: UserRecord = {
    id: randomUUID(),
    fullName,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(record);
  await writeUsers(users);
  return record;
}
