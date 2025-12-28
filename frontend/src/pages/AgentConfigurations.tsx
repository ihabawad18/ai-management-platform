import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Loader2, Plus } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import AgentPagination from "@/components/AgentPagination";
import FormModal from "@/components/FormModal";
import { useConversations } from "@/contexts/ConversationsContext";
import { useLlmModels } from "@/contexts/LlmModelsContext";
import { getLlmModelLabel, getLlmModelOptions } from "@/constants/llmModels";
import {
  createAgentConfiguration,
  deleteAgentConfiguration,
  getAgentConfigurations,
  updateAgentConfiguration,
  ApiError,
  toErrorMessages,
} from "@/services/ApiService";
import type { AgentUI } from "@/types/components/AgentCard.types";

export default function AgentConfigurations() {
  const navigate = useNavigate();
  const { startConversationForAgent } = useConversations();
  const { models: llmModels } = useLlmModels();

  const [agents, setAgents] = useState<AgentUI[]>([]);
  const [editingAgent, setEditingAgent] = useState<AgentUI | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<AgentUI>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const itemsPerPage = 4;
  const [listLoading, setListLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setListLoading(true);
        const data = await getAgentConfigurations();
        const mapped: AgentUI[] = data.map((a) => ({
          id: a.id,
          title: a.name ?? a.title ?? "",
          modelName: a.model ?? a.modelName ?? "",
          systemPrompt: a.systemPrompt ?? "",
        }));
        setAgents(mapped);
      } catch (e) {
        console.error("Failed to load agent configurations", e);
      } finally {
        setListLoading(false);
      }
    };
    void load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(agents.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgents = agents.slice(startIndex, endIndex);

  const handleEdit = (agent: AgentUI) => {
    setEditingAgent(agent);
    setFormData(agent);
    setFormErrors([]);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: "",
      modelName: llmModels[0] ?? "GPT_4O",
      systemPrompt: "",
    });
    setFormErrors([]);
  };

  const handleSave = async () => {
    if (isCreating) {
      try {
        setActionLoading(true);
        const created = await createAgentConfiguration({
          name: formData.title ?? "",
          model: formData.modelName ?? "",
          systemPrompt: formData.systemPrompt ?? "",
        });
        setAgents((prev) => [
          ...prev,
          {
            id: created.id,
            title: created.name ?? created.title ?? "",
            modelName: created.model ?? created.modelName ?? "",
            systemPrompt: created.systemPrompt ?? "",
          },
        ]);
        setIsCreating(false);
        setFormErrors([]);
      } catch (e) {
        const messages =
          e instanceof ApiError ? e.messages : toErrorMessages(e);
        setFormErrors(messages);
        console.error("Failed to create agent configuration", e);
      } finally {
        setActionLoading(false);
      }
    } else if (editingAgent) {
      try {
        setActionLoading(true);
        const updated = await updateAgentConfiguration(editingAgent.id, {
          name: formData.title,
          model: formData.modelName,
          systemPrompt: formData.systemPrompt,
        });
        setAgents((prev) =>
          prev.map((a) =>
            a.id === editingAgent.id
              ? {
                  id: updated.id,
                  title: updated.name ?? updated.title ?? "",
                  modelName: updated.model ?? updated.modelName ?? "",
                  systemPrompt: updated.systemPrompt ?? "",
                }
              : a
          )
        );
        setEditingAgent(null);
        setFormErrors([]);
      } catch (e) {
        const messages =
          e instanceof ApiError ? e.messages : toErrorMessages(e);
        setFormErrors(messages);
        console.error("Failed to update agent configuration", e);
      } finally {
        setActionLoading(false);
      }
    }
    setFormData({});
  };

  const handleClose = () => {
    setEditingAgent(null);
    setIsCreating(false);
    setFormData({});
    setFormErrors([]);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAgentConfiguration(id);
      setAgents((prev) => {
        const next = prev.filter((a) => a.id !== id);
        const totalPagesAfter = Math.max(
          1,
          Math.ceil(next.length / itemsPerPage)
        );
        if (currentPage > totalPagesAfter) {
          setCurrentPage(totalPagesAfter);
        }
        return next;
      });
    } catch (e) {
      console.error("Failed to delete agent configuration", e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartChat = (agent: AgentUI) => {
    startConversationForAgent({
      id: agent.id,
      name: agent.title,
      model: agent.modelName,
      systemPrompt: agent.systemPrompt,
    });
    navigate(`/chat/${agent.id}`);
  };

  const isDirty =
    isCreating ||
    (editingAgent != null &&
      (formData.title ?? editingAgent.title) !== editingAgent.title) ||
    (editingAgent != null &&
      (formData.modelName ?? editingAgent.modelName) !==
        editingAgent.modelName) ||
    (editingAgent != null &&
      (formData.systemPrompt ?? editingAgent.systemPrompt) !==
        editingAgent.systemPrompt);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Agent Configurations
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your AI agent configurations and system prompts
          </p>
        </div>
        <Button
          onClick={handleCreate}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      {listLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-700">Loading agents...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStartChat={handleStartChat}
              actionDisabled={actionLoading || deletingId === agent.id}
              deleteLoading={deletingId === agent.id}
            />
          ))}
        </div>
      )}

      <AgentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <FormModal<AgentUI>
        open={editingAgent !== null || isCreating}
        title={isCreating ? "Create New Agent" : "Edit Agent Configuration"}
        description="Configure the agent's model and system prompt"
        fields={[
          {
            type: "text",
            name: "title",
            label: "Title",
            placeholder: "e.g., Customer Support Agent",
          },
          {
            type: "select",
            name: "modelName",
            label: "Model Name",
            placeholder: "Select model",
            options:
              llmModels.length > 0
                ? getLlmModelOptions(llmModels)
                : [
                    {
                      label: getLlmModelLabel("GPT_4O"),
                      value: "GPT_4O",
                    },
                  ],
          },
          {
            type: "textarea",
            name: "systemPrompt",
            label: "System Prompt",
            placeholder: "Enter the system prompt for this agent...",
          },
        ]}
        values={formData}
        onChange={setFormData}
        onClose={handleClose}
        onSave={handleSave}
        confirmText={isCreating ? "Create" : "Save Changes"}
        loading={actionLoading}
        confirmDisabled={!isDirty}
        errors={formErrors}
      />
    </div>
  );
}
