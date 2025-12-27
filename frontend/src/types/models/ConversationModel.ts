import type { Message } from "./message.model";

export interface Conversation {
  id: string;
  title: string;
  agentId: string;
  messages: Message[];
  createdAt: Date;
}

