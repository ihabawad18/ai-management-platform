export interface MessageModel {
  id: string;
  conversationId?: string;
  role: string;
  content: string;
  createdAt: string | Date;
  timestamp?: Date;
}
