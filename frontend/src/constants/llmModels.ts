const LLM_MODEL_LABELS: Record<string, string> = {
  GPT_5_2: "gpt-5.2",
  GPT_5_MINI: "gpt-5-mini",
  GPT_5_NANO: "gpt-5-nano",
  GPT_4_1: "gpt-4.1",
  GPT_4O: "gpt-4o",
};

export const getLlmModelLabel = (model: string) =>
  LLM_MODEL_LABELS[model] ?? model?.toLowerCase().replace(/_/g, "-");

export const getLlmModelOptions = (models: string[]) =>
  models.map((model) => ({
    value: model,
    label: getLlmModelLabel(model),
  }));
