export interface ConversationModel {
  id: string;
  agentConfigurationId?: string;
  title: string;
  lastMessageAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  messages?: import("./Message.model").MessageModel[];
  agentId?: string;
}

export interface ConversationListItemModel extends ConversationModel {
  lastMessage?: string | null;
}
