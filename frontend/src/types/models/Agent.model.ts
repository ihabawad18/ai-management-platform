export interface AgentModel {
  id: string;
  name?: string;
  title?: string;
  systemPrompt?: string;
  model?: string;
  modelName?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
