import type { ReactNode } from "react";
import type { AgentModel } from "@/types/models/Agent.model";

export interface AgentsContextProps {
  agents: AgentModel[];
  updateAgent: (agent: AgentModel) => void;
  deleteAgent: (id: string) => void;
  createAgent: (agent: Omit<AgentModel, "id">) => AgentModel;
}

export interface AgentsProviderProps {
  children: ReactNode;
}
