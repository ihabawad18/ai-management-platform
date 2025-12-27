import type { AgentCardProps } from "@/types/components/AgentCard.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { getLlmModelLabel } from "@/constants/llmModels";

const AgentCard = ({
  agent,
  onEdit,
  onDelete,
  onStartChat,
  actionDisabled = false,
  deleteLoading = false,
}: AgentCardProps) => (
  <Card className="group hover:shadow-lg transition-all duration-300 border bg-white">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">
              {agent.title ?? agent.name ?? ""}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-2">
            <code className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-mono">
              {getLlmModelLabel(agent.modelName ?? agent.model ?? "")}
            </code>
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-700 font-medium mb-2">
            System Prompt
          </p>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border line-clamp-3">
            {agent.systemPrompt}
          </p>
        </div>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(agent)}
            disabled={actionDisabled}
            className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer disabled:opacity-60"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            onClick={() => onStartChat(agent)}
            disabled={actionDisabled}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-60"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Start Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(agent.id)}
            disabled={actionDisabled}
            className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-400 transition-colors cursor-pointer disabled:opacity-60"
          >
            {deleteLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AgentCard;
