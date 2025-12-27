export type AgentLike = {
  id: string;
  title: string;
  modelName: string;
  systemPrompt: string;
  name?: string;
  model?: string;
};

export type AgentUI = AgentLike;

export type AgentCardProps = {
  agent: AgentUI;
  onEdit: (agent: AgentUI) => void;
  onDelete: (id: string) => void;
  onStartChat: (agent: AgentUI) => void;
  actionDisabled?: boolean;
  deleteLoading?: boolean;
};
