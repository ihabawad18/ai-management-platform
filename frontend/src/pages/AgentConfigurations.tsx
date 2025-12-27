import { useState } from "react";
import type { AgentConfig } from "@/types/models/AgentModel";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useAgents } from "@/contexts/AgentsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import AgentCard from "@/components/AgentCard";
import AgentPagination from "@/components/AgentPagination";
import FormModal from "@/components/FormModal";

export default function AgentConfigurations() {
  const { agents, updateAgent, deleteAgent, createAgent } = useAgents();
  const { startConversationForAgent } = useConversations();
  const [editingAgent, setEditingAgent] = useState<AgentConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<AgentConfig>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(agents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgents = agents.slice(startIndex, endIndex);

  const handleEdit = (agent: AgentConfig) => {
    setEditingAgent(agent);
    setFormData(agent);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: "",
      modelName: "gpt-4o",
      systemPrompt: "",
    });
  };

  const handleSave = () => {
    if (isCreating) {
      createAgent(formData as Omit<AgentConfig, "id">);
      setIsCreating(false);
    } else if (editingAgent) {
      updateAgent({ ...editingAgent, ...formData } as AgentConfig);
      setEditingAgent(null);
    }
    setFormData({});
  };

  const handleClose = () => {
    setEditingAgent(null);
    setIsCreating(false);
    setFormData({});
  };

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
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onEdit={handleEdit}
            onDelete={deleteAgent}
            onStartChat={startConversationForAgent}
          />
        ))}
      </div>

      <AgentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <FormModal<AgentConfig>
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
            options: [
              { label: "gpt-4o", value: "gpt-4o" },
              { label: "gpt-4o-mini", value: "gpt-4o-mini" },
              { label: "gpt-4-turbo", value: "gpt-4-turbo" },
              { label: "gpt-3.5-turbo", value: "gpt-3.5-turbo" },
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
      />
    </div>
  );
}
