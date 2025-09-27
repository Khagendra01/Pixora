export type ChatMessage = {
  id: string;
  author: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
};

export type ChatSession = {
  userEmail: string;
  messages: ChatMessage[];
  updatedAt: string;
};
