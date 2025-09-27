export type ChatMessage = {
  id: string;
  author: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

export type ChatSession = {
  id: string;
  userEmail: string;
  title: string;
  messages: ChatMessage[];
  assetRelativePath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatSessionSummary = Pick<
  ChatSession,
  "id" | "title" | "createdAt" | "updatedAt"
>;
