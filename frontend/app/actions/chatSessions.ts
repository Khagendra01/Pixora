"use server";

import type { ChatMessage } from "@/lib/chatMessages";
import {
  clearChatSession,
  getChatSessionByEmail,
  upsertChatSession,
} from "@/lib/chatSessionStore";

export async function fetchChatSession(email: string) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email is required to fetch chat session.",
    };
  }

  const record = await getChatSessionByEmail(trimmedEmail);

  if (!record) {
    return {
      status: "empty" as const,
      messages: [],
    };
  }

  return {
    status: "success" as const,
    messages: record.messages,
    updatedAt: record.updatedAt,
  };
}

export async function persistChatSession({
  email,
  messages,
}: {
  email: string;
  messages: ChatMessage[];
}) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email is required to save chat session.",
    };
  }

  const record = await upsertChatSession({
    email: trimmedEmail,
    messages,
  });

  return {
    status: "success" as const,
    updatedAt: record.updatedAt,
  };
}

export async function resetChatSession(email: string) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      status: "error" as const,
      message: "Email is required to reset chat session.",
    };
  }

  await clearChatSession(trimmedEmail);

  return {
    status: "success" as const,
  };
}
