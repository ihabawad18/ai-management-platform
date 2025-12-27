import type { ReactNode } from "react";
import type { AgentConfig } from "@/types/models/AgentModel";
import type { Conversation } from "@/types/models/ConversationModel";

export interface ConversationsContextProps {
  conversations: Conversation[];
  createConversation: (title: string, agentId: string) => Conversation;
  sendMessage: (conversationId: string, content: string) => void;
  startConversationForAgent: (agent: AgentConfig) => Conversation;
}

export interface ConversationsProviderProps {
  children: ReactNode;
}
