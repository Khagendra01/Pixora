"use server";

import type { ChatMessage } from "@/lib/chatMessages";
import {
  createChatSession,
  getChatSession,
  getMostRecentChatSession,
  listChatSessions,
  updateChatSession,
} from "@/lib/chatSessionStore";

export async function fetchChatSession(email: string, sessionId?: string) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email is required to fetch chat session.",
    };
  }

  const [sessions, activeSession] = await Promise.all([
    listChatSessions(trimmedEmail),
    sessionId
      ? getChatSession({ email: trimmedEmail, sessionId })
      : getMostRecentChatSession(trimmedEmail),
  ]);

  if (!activeSession) {
    return {
      status: "success" as const,
      sessions,
      activeSession: null,
    };
  }

  return {
    status: "success" as const,
    sessions,
    activeSession,
  };
}

export async function persistChatSession({
  email,
  sessionId,
  messages,
  assetRelativePath,
}: {
  email: string;
  sessionId: string;
  messages: ChatMessage[];
  assetRelativePath?: string | null;
}) {
  const trimmedEmail = email.trim();
  const trimmedSessionId = sessionId.trim();

  if (!trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email is required to save chat session.",
    };
  }

  if (!trimmedSessionId) {
    return {
      status: "error" as const,
      message: "Session ID is required to save chat session.",
    };
  }

  try {
    const record = await updateChatSession({
      email: trimmedEmail,
      sessionId: trimmedSessionId,
      messages,
      assetRelativePath,
    });

    return {
      status: "success" as const,
      session: record,
    };
  } catch (error) {
    return {
      status: "error" as const,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update chat session.",
    };
  }
}

export async function createChatSessionAction({
  email,
  title,
}: {
  email: string;
  title?: string;
}) {
  const trimmedEmail = email.trim();
  const trimmedTitle = title?.trim();

  if (!trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email is required to create chat session.",
    };
  }

  const record = await createChatSession({
    email: trimmedEmail,
    title: trimmedTitle,
  });

  const sessions = await listChatSessions(trimmedEmail);

  return {
    status: "success" as const,
    session: record,
    sessions,
  };
}
