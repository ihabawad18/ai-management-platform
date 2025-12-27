import React, { createContext, useContext, useEffect, useState } from "react";
import { getAvailableLlmModels } from "@/services/ApiService";
import type {
  LlmModelsContextProps,
  LlmModelsProviderProps,
} from "@/types/contexts/LlmModelsContextTypes";

const LlmModelsContext = createContext<LlmModelsContextProps>(
  {} as LlmModelsContextProps
);

// eslint-disable-next-line react-refresh/only-export-components
export const useLlmModels = () => useContext(LlmModelsContext);

export const LlmModelsProvider: React.FC<LlmModelsProviderProps> = ({
  children,
}) => {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAvailableLlmModels();
      setModels(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load LLM models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadModels();
  }, []);

  return (
    <LlmModelsContext.Provider
      value={{
        models,
        loading,
        error,
        refresh: loadModels,
      }}
    >
      {children}
    </LlmModelsContext.Provider>
  );
};
