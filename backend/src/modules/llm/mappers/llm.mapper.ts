import { LlmModel } from "../enums/llm-model.enum";

export const LLM_MODEL_MAP: Record<LlmModel, string> = {
  [LlmModel.GPT_5_2]: "gpt-5.2",
  [LlmModel.GPT_5_MINI]: "gpt-5-mini",
  [LlmModel.GPT_5_NANO]: "gpt-5-nano",
  [LlmModel.GPT_4_1]: "gpt-4.1",
  [LlmModel.GPT_4O]: "gpt-4o",
};

export function mapToOpenAiModel(model: LlmModel): string {
  return LLM_MODEL_MAP[model];
}
