export type MessageView = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  pending?: boolean;
};

export type ConversationView = {
  id: string;
  title: string;
  agentId: string;
  createdAt: Date;
  lastMessageAt: Date;
  messages: MessageView[];
};
