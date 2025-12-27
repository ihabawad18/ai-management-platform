import React, { createContext, useContext, useState } from "react";
import type { AgentModel } from "@/types/models/Agent.model";
import type {
  AgentsContextProps,
  AgentsProviderProps,
} from "@/types/contexts/AgentsContextTypes";

const AgentsContext = createContext<AgentsContextProps>(
  {} as AgentsContextProps
);

// eslint-disable-next-line react-refresh/only-export-components
export const useAgents = () => useContext(AgentsContext);

export const AgentsProvider: React.FC<AgentsProviderProps> = ({ children }) => {
  const [agents, setAgents] = useState<AgentModel[]>([]);

  const updateAgent = (agent: AgentModel) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, ...agent } : a))
    );
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const createAgent = (agent: Omit<AgentModel, "id">) => {
    const newAgent: AgentModel = { ...agent, id: crypto.randomUUID() };
    setAgents((prev) => [...prev, newAgent]);
    return newAgent;
  };

  return (
    <AgentsContext.Provider
      value={{ agents, updateAgent, deleteAgent, createAgent }}
    >
      {children}
    </AgentsContext.Provider>
  );
};
