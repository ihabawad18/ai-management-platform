import type { ReactNode } from "react";

export interface LlmModelsContextProps {
  models: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface LlmModelsProviderProps {
  children: ReactNode;
}
