import type { ReactNode } from "react";
import type { AgentConfig } from "@/types/models/AgentModel";

export interface AgentsContextProps {
  agents: AgentConfig[];
  updateAgent: (agent: AgentConfig) => void;
  deleteAgent: (id: string) => void;
  createAgent: (agent: Omit<AgentConfig, "id">) => AgentConfig;
}

export interface AgentsProviderProps {
  children: ReactNode;
}
