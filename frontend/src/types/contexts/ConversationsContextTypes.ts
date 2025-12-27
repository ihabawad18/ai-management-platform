import type { ReactNode } from "react";
import type { AgentModel } from "@/types/models/Agent.model";
import type { ConversationModel } from "@/types/models/Conversation.model";

export interface ConversationsContextProps {
  conversations: ConversationModel[];
  createConversation: (title: string, agentId: string) => ConversationModel;
  sendMessage: (conversationId: string, content: string) => void;
  startConversationForAgent: (agent: AgentModel) => ConversationModel;
}

export interface ConversationsProviderProps {
  children: ReactNode;
}
