import axiosClient from "./AxiosClientService";

import type { AgentModel } from "@/types/models/Agent.model";
import type {
  ConversationModel,
  ConversationListItemModel,
} from "@/types/models/Conversation.model";
import type { MessageModel } from "@/types/models/Message.model";
import type { Paginated } from "@/types/models/Pagination.model";

const toErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unknown error";

const unwrap = <T>(response: { data: unknown }): T => {
  const { data } = response;
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: T }).data;
  }
  return data as T;
};

export const getAgentConfigurations = async (): Promise<
  AgentModel[]
> => {
  try {
    const response = await axiosClient.get<AgentModel[]>(
      "/agent-configurations"
    );
    return unwrap<AgentModel[]>(response);
  } catch (error) {
    throw new Error(
      `Failed to fetch agent configurations: ${toErrorMessage(error)}`
    );
  }
};

export const getAgentConfiguration = async (
  id: string
): Promise<AgentModel> => {
  try {
    const response = await axiosClient.get<AgentModel>(
      `/agent-configurations/${id}`
    );
    return unwrap<AgentModel>(response);
  } catch (error) {
    throw new Error(
      `Failed to fetch agent configuration: ${toErrorMessage(error)}`
    );
  }
};

export const createAgentConfiguration = async (
  payload: Pick<AgentModel, "name" | "model" | "systemPrompt">
): Promise<AgentModel> => {
  try {
    const response = await axiosClient.post<AgentModel>(
      "/agent-configurations",
      payload
    );
    return unwrap<AgentModel>(response);
  } catch (error) {
    throw new Error(
      `Failed to create agent configuration: ${toErrorMessage(error)}`
    );
  }
};

export const updateAgentConfiguration = async (
  id: string,
  payload: Partial<
    Pick<AgentModel, "name" | "model" | "systemPrompt">
  >
): Promise<AgentModel> => {
  try {
    const response = await axiosClient.patch<AgentModel>(
      `/agent-configurations/${id}`,
      payload
    );
    return unwrap<AgentModel>(response);
  } catch (error) {
    throw new Error(
      `Failed to update agent configuration: ${toErrorMessage(error)}`
    );
  }
};

export const deleteAgentConfiguration = async (id: string): Promise<void> => {
  try {
    await axiosClient.delete(`/agent-configurations/${id}`);
  } catch (error) {
    throw new Error(
      `Failed to delete agent configuration: ${toErrorMessage(error)}`
    );
  }
};

export const getConversations = async (
  agentId: string,
  params?: { page?: number; pageSize?: number }
): Promise<Paginated<ConversationListItemModel>> => {
  try {
    const response = await axiosClient.get<
      Paginated<ConversationListItemModel>
    >(
      `/agents/${agentId}/conversations`,
      { params }
    );
    return unwrap<Paginated<ConversationListItemModel>>(response);
  } catch (error) {
    throw new Error(`Failed to fetch conversations: ${toErrorMessage(error)}`);
  }
};

export const createConversation = async (payload: {
  agentId: string;
  title: string;
}): Promise<ConversationModel> => {
  try {
    const response = await axiosClient.post<ConversationModel>(
      "/conversations",
      payload
    );
    return unwrap<ConversationModel>(response);
  } catch (error) {
    throw new Error(`Failed to create conversation: ${toErrorMessage(error)}`);
  }
};

export const sendMessage = async (
  conversationId: string,
  payload: { content: string }
): Promise<{
  userMessage: MessageModel;
  assistantMessage: MessageModel;
}> => {
  try {
    const response = await axiosClient.post<
      | { userMessage: MessageModel; assistantMessage: MessageModel }
      | { messages: MessageModel[] }
    >(`/conversations/${conversationId}/messages`, payload);

    const raw = unwrap<
      | { userMessage: MessageModel; assistantMessage: MessageModel }
      | { messages: MessageModel[] }
    >(response);

    if ("userMessage" in raw && "assistantMessage" in raw) {
      return raw;
    }

    if ("messages" in raw && Array.isArray(raw.messages)) {
      const [userMessage, assistantMessage] = raw.messages;
      if (userMessage && assistantMessage) {
        return { userMessage, assistantMessage };
      }
    }

    throw new Error("Unexpected send message response shape");
  } catch (error) {
    throw new Error(`Failed to send message: ${toErrorMessage(error)}`);
  }
};

export const getConversationMessages = async (
  conversationId: string,
  params?: { page?: number; pageSize?: number }
): Promise<Paginated<MessageModel>> => {
  try {
    const response = await axiosClient.get<Paginated<MessageModel>>(
      `/conversations/${conversationId}/messages`,
      { params }
    );
    return unwrap<Paginated<MessageModel>>(response);
  } catch (error) {
    throw new Error(
      `Failed to fetch conversation messages: ${toErrorMessage(error)}`
    );
  }
};

export const getAvailableLlmModels = async (): Promise<string[]> => {
  try {
    const response = await axiosClient.get<string[]>("/llm/models");
    return unwrap<string[]>(response);
  } catch (error) {
    throw new Error(
      `Failed to fetch available LLM models: ${toErrorMessage(error)}`
    );
  }
};
