import { useState, useRef, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Plus, Send, Loader2, ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgents } from "@/contexts/AgentsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { formatTime } from "@/services/UtilityService";
import FormModal from "@/components/FormModal";

export default function Chat() {
  const { agents } = useAgents();
  const { conversations, createConversation, sendMessage } = useConversations();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents[0]?.id || ""
  );
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id || ""
  );
  const [messageInput, setMessageInput] = useState("");
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [conversationForm, setConversationForm] = useState<{ title: string }>({
    title: "",
  });

  const [displayedConversationsCount, setDisplayedConversationsCount] =
    useState(3);
  const displayedConversations = conversations.slice(
    0,
    displayedConversationsCount
  );
  const hasMoreConversations =
    displayedConversationsCount < conversations.length;

  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );
  const currentAgent = agents.find(
    (a) => a.id === currentConversation?.agentId
  );

  const loadMoreConversations = () => {
    setDisplayedConversationsCount((prev) =>
      Math.min(prev + 3, conversations.length)
    );
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;

    if (scrollTop < 100 && !isLoadingMoreMessages && currentConversation) {
      simulateLoadMoreMessages();
    }
  };

  const simulateLoadMoreMessages = () => {
    setIsLoadingMoreMessages(true);
    setTimeout(() => {
      setIsLoadingMoreMessages(false);
    }, 1500);
  };

  useEffect(() => {
    if (scrollAreaRef.current && !hasScrolledToBottom) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      setTimeout(() => setHasScrolledToBottom(true), 0);
    }
  }, [currentConversation?.messages, hasScrolledToBottom]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [selectedConversationId]);

  const handleSend = () => {
    if (messageInput.trim() && selectedConversationId) {
      sendMessage(selectedConversationId, messageInput);
      setMessageInput("");
    }
  };

  const handleCreateConversation = () => {
    if (newConversationTitle.trim() && selectedAgentId) {
      createConversation(newConversationTitle, selectedAgentId);
      setNewConversationTitle("");
      setConversationForm({ title: "" });
      setIsCreatingConversation(false);
    }
  };

  return (
    <div className="h-[calc(100vh-82px)] bg-gray-50">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
          <div className="h-full flex flex-col border-r bg-white">
            <div className="p-4 border-b space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">
                  Conversations
                </h2>
                <Button
                  size="sm"
                  onClick={() => setIsCreatingConversation(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              <Select
                value={selectedAgentId}
                onValueChange={setSelectedAgentId}
              >
                <SelectTrigger className="border bg-white text-gray-900">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 bg-gray-50 overflow-y-auto">
              <div className="p-2 space-y-1">
                {displayedConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-all border cursor-pointer",
                      selectedConversationId === conversation.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:border-blue-300"
                    )}
                  >
                    <div className="font-medium text-sm truncate">
                      {conversation.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        selectedConversationId === conversation.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      )}
                    >
                      {formatTime(conversation.createdAt)}
                    </div>
                  </button>
                ))}

                {hasMoreConversations && (
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
                    onClick={loadMoreConversations}
                  >
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Load More Conversations
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={75}>
          <div className="h-full flex flex-col bg-white">
            {currentConversation && (
              <div className="p-4 border-b bg-white">
                <h3 className="font-semibold text-lg text-gray-900">
                  {currentConversation.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Using {currentAgent?.title || "Unknown Agent"} •{" "}
                  {currentAgent?.modelName}
                </p>
              </div>
            )}

            <div
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
              ref={scrollAreaRef}
              onScroll={handleScroll}
            >
              {currentConversation ? (
                <div className="space-y-4">
                  {isLoadingMoreMessages && (
                    <div className="flex justify-center py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-full border shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        Loading older messages...
                      </div>
                    </div>
                  )}

                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-900 border shadow-sm"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-1",
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600">
                      Select a conversation to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>

            {currentConversation && (
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSend()
                    }
                    placeholder="Type a message..."
                    className="flex-1 border bg-white text-gray-900 focus-visible:ring-blue-500"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <FormModal<{ title: string }>
        open={isCreatingConversation}
        title="New Conversation"
        description="Create a new conversation with the selected agent"
        fields={[
          {
            type: "text",
            name: "title",
            label: "Conversation Title",
            placeholder: "e.g., Help with product features",
          },
        ]}
        values={conversationForm}
        onChange={(data) => {
          const title = (data.title ?? "") as string;
          setConversationForm({ title });
          setNewConversationTitle(title);
        }}
        onClose={() => setIsCreatingConversation(false)}
        onSave={handleCreateConversation}
        confirmText="Create"
      />
    </div>
  );
}
