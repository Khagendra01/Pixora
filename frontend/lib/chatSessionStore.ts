import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  ChatMessage,
  ChatSession,
  ChatSessionSummary,
} from "./chatMessages";

type StoredChatSession = ChatSession;

type LegacyChatSession = {
  userEmail: string;
  messages: ChatMessage[];
  assetRelativePath?: string | null;
  updatedAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const chatSessionsPath = path.join(dataDirectory, "chatSessions.json");

async function ensureDataDirectory() {
  await fs.mkdir(dataDirectory, { recursive: true });
}

function deriveSessionTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((message) => message.role === "user");

  if (firstUserMessage) {
    const trimmed = firstUserMessage.content.trim();

    if (trimmed.length > 0) {
      return trimmed.length > 64 ? `${trimmed.slice(0, 61)}...` : trimmed;
    }
  }

  return "New conversation";
}

function normalizeSession(
  session: StoredChatSession | LegacyChatSession,
): ChatSession {
  const id = "id" in session && session.id ? session.id : randomUUID();
  const createdAt =
    "createdAt" in session && session.createdAt
      ? session.createdAt
      : session.updatedAt;

  const normalized: ChatSession = {
    id,
    userEmail: session.userEmail.toLowerCase(),
    messages: [...session.messages],
    assetRelativePath: session.assetRelativePath ?? null,
    createdAt,
    updatedAt: session.updatedAt,
    title:
      "title" in session && session.title
        ? session.title
        : deriveSessionTitle(session.messages),
  };

  return normalized;
}

async function readChatSessions(): Promise<ChatSession[]> {
  try {
    const file = await fs.readFile(chatSessionsPath, "utf-8");
    const parsed = JSON.parse(file) as (
      | StoredChatSession
      | LegacyChatSession
    )[];

    if (!Array.isArray(parsed)) {
      return [];
    }
    let requiresWriteBack = false;

    const normalized = parsed.map((session) => {
      if (
        !("id" in session && session.id) ||
        !("title" in session && session.title) ||
        !("createdAt" in session && session.createdAt)
      ) {
        requiresWriteBack = true;
      }

      return normalizeSession(session);
    });

    if (requiresWriteBack) {
      await writeChatSessions(normalized);
    }

    return normalized;
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

export async function listChatSessions(
  email: string,
): Promise<ChatSessionSummary[]> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  return sessions
    .filter((session) => session.userEmail === normalizedEmail)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .map(({ id, title, createdAt, updatedAt }) => ({
      id,
      title,
      createdAt,
      updatedAt,
    }));
}

export async function getChatSession({
  email,
  sessionId,
}: {
  email: string;
  sessionId: string;
}): Promise<ChatSession | undefined> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  return sessions.find(
    (session) =>
      session.userEmail === normalizedEmail && session.id === sessionId,
  );
}

export async function getMostRecentChatSession(
  email: string,
): Promise<ChatSession | undefined> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  return sessions
    .filter((session) => session.userEmail === normalizedEmail)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0];
}

export async function createChatSession({
  email,
  title,
}: {
  email: string;
  title?: string;
}): Promise<ChatSession> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  const now = new Date().toISOString();
  const record: ChatSession = {
    id: randomUUID(),
    userEmail: normalizedEmail,
    title: title?.trim() || "New conversation",
    messages: [],
    assetRelativePath: null,
    createdAt: now,
    updatedAt: now,
  };

  sessions.push(record);
  await writeChatSessions(sessions);

  return record;
}

export async function updateChatSession({
  email,
  sessionId,
  messages,
  assetRelativePath,
  title,
}: {
  email: string;
  sessionId: string;
  messages: ChatMessage[];
  assetRelativePath?: string | null;
  title?: string;
}): Promise<ChatSession> {
  const normalizedEmail = email.toLowerCase();
  const sessions = await readChatSessions();
  const existingIndex = sessions.findIndex(
    (session) =>
      session.userEmail === normalizedEmail && session.id === sessionId,
  );

  if (existingIndex < 0) {
    throw new Error("Chat session not found.");
  }

  const now = new Date().toISOString();
  const nextTitle = title?.trim() || deriveSessionTitle(messages);

  const record: ChatSession = {
    ...sessions[existingIndex],
    messages: [...messages],
    assetRelativePath: assetRelativePath ?? null,
    updatedAt: now,
    title: nextTitle,
  };

  sessions[existingIndex] = record;
  await writeChatSessions(sessions);

  return record;
}
