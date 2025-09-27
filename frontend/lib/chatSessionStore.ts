import { promises as fs } from "node:fs";
import path from "node:path";

import type { ChatMessage, ChatSession } from "./chatMessages";

type StoredChatSession = Omit<ChatSession, "assetRelativePath"> & {
  assetRelativePath?: string | null;
};

const dataDirectory = path.join(process.cwd(), "data");
const chatSessionsPath = path.join(dataDirectory, "chatSessions.json");

async function ensureDataDirectory() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

async function readChatSessions(): Promise<ChatSession[]> {
  try {
    const file = await fs.readFile(chatSessionsPath, "utf-8");
    const parsed = JSON.parse(file) as StoredChatSession[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((session) => ({
      ...session,
      assetRelativePath: session.assetRelativePath ?? null,
    }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeChatSessions(sessions: ChatSession[]) {
  await ensureDataDirectory();
  await fs.writeFile(
    chatSessionsPath,
    `${JSON.stringify(sessions, null, 2)}\n`,
    "utf-8",
  );
}

export async function getChatSessionByEmail(
  email: string,
): Promise<ChatSession | undefined> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  return sessions.find((session) => session.userEmail === normalizedEmail);
}

export async function upsertChatSession({
  email,
  messages,
  assetRelativePath,
}: {
  email: string;
  messages: ChatMessage[];
  assetRelativePath?: string | null;
}): Promise<ChatSession> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  const existingIndex = sessions.findIndex(
    (session) => session.userEmail === normalizedEmail,
  );

  const record: ChatSession = {
    userEmail: normalizedEmail,
    messages,
    assetRelativePath: assetRelativePath ?? null,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    sessions[existingIndex] = record;
  } else {
    sessions.push(record);
  }

  await writeChatSessions(sessions);

  return record;
}

export async function clearChatSession(email: string): Promise<void> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  const nextSessions = sessions.filter(
    (session) => session.userEmail !== normalizedEmail,
  );

  if (nextSessions.length === sessions.length) {
    return;
  }

  await writeChatSessions(nextSessions);
}
