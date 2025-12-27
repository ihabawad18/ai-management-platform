import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getLlmModelLabel } from "@/constants/llmModels";
import { formatTime } from "@/services/UtilityService";
import FormModal from "@/components/FormModal";
import {
  getAgentConfigurations,
  createConversation as apiCreateConversation,
  getConversationMessages,
  getConversations,
  sendMessage as apiSendMessage,
} from "@/services/ApiService";

import type { Paginated } from "@/types/models/Pagination.model";
import type { MessageModel } from "@/types/models/Message.model";
import type { ConversationView, MessageView } from "@/types/pages/ChatTypes";

const pageSize = 4;
const messagesPageSize = 15;
const safeDate = (value?: string | Date | null) =>
  value ? new Date(value) : new Date(0);

export default function Chat() {
  const { agentId: agentIdParam } = useParams<{ agentId?: string }>();
  const navigate = useNavigate();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);
  const [stackedLayout, setStackedLayout] = useState(false);

  type AgentItem = {
    id: string;
    title: string;
    modelName: string;
    systemPrompt: string;
    name?: string;
    model?: string;
  };

  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const [conversations, setConversations] = useState<ConversationView[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [conversationsPage, setConversationsPage] = useState(1);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const [messagesPaging, setMessagesPaging] = useState<
    Record<string, { page: number; totalPages: number; loading: boolean }>
  >({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState("");
  const [conversationForm, setConversationForm] = useState<{ title: string }>({
    title: "",
  });

  const currentConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId]
  );
  const currentAgent = agents.find(
    (a) => a.id === currentConversation?.agentId
  );

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setAgentsLoading(true);
        const data = await getAgentConfigurations();
        const mapped: AgentItem[] = data.map((a) => ({
          id: a.id,
          title: a.name ?? a.title ?? "",
          modelName: a.model ?? a.modelName ?? "",
          systemPrompt: a.systemPrompt ?? "",
          name: a.name,
          model: a.model,
        }));
        setAgents(mapped);

        const desired =
          mapped.find((a) => a.id === agentIdParam) ?? mapped[0] ?? null;
        if (desired) setSelectedAgentId(desired.id);
      } catch (e) {
        console.error("Failed to load agents", e);
      } finally {
        setAgentsLoading(false);
      }
    };
    void loadAgents();
  }, [agentIdParam]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1050px)");
    const handleChange = () => setStackedLayout(mq.matches);
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      navigate(`/chat/${selectedAgentId}`, { replace: true });
      setSelectedConversationId("");
      setConversations([]);
      setConversationsPage(1);
      void loadConversations(selectedAgentId, 1);
    }
  }, [selectedAgentId]);

  const loadConversations = async (agentId: string, page = 1) => {
    setLoadingConversations(true);
    try {
      const data = await getConversations(agentId, { page, pageSize });
      const mapped = data.items.map<ConversationView>((c) => ({
        id: c.id,
        title: c.title,
        agentId: c.agentConfigurationId ?? c.agentId ?? "",
        createdAt: safeDate(c.createdAt),
        lastMessageAt: safeDate(c.lastMessageAt ?? c.createdAt),
        messages: [],
      }));
      setHasMoreConversations(data.meta.currentPage < data.meta.totalPages);
      setConversations((prev) =>
        sortConversations(page === 1 ? mapped : [...prev, ...mapped])
      );
      // Leave conversation unselected by default
    } catch (e) {
      console.error("Failed to load conversations", e);
    } finally {
      setLoadingConversations(false);
    }
  };

  const mapMessages = (items: MessageModel[]): MessageView[] =>
    items
      .slice()
      .reverse()
      .map((m) => ({
        id: m.id,
        content: m.content,
        role: m.role as "user" | "assistant",
        timestamp: new Date(m.createdAt),
      }));

  const loadMessages = async (conversationId: string, page = 1) => {
    if (!conversationId) return;
    const prevScrollBottom =
      page > 1 && scrollAreaRef.current
        ? scrollAreaRef.current.scrollHeight - scrollAreaRef.current.scrollTop
        : 0;

    setMessagesPaging((prev) => ({
      ...prev,
      [conversationId]: {
        page,
        totalPages: prev[conversationId]?.totalPages ?? 1,
        loading: true,
      },
    }));
    setLoadingMessages(page === 1);

    try {
      const data: Paginated<MessageModel> = await getConversationMessages(
        conversationId,
        {
          page,
          pageSize: messagesPageSize,
        }
      );
      // just for demo purposes, simulate network delay
      await new Promise((res) => setTimeout(res, 1000));

      const mapped = mapMessages(data.items);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const mergedMessages =
            page === 1
              ? mapped
              : [
                  ...mapped.filter(
                    (m) => !c.messages.some((msg) => msg.id === m.id)
                  ),
                  ...c.messages,
                ];
          return {
            ...c,
            messages: mergedMessages,
            lastMessageAt: safeDate(
              mergedMessages[mergedMessages.length - 1]?.timestamp ??
                c.lastMessageAt ??
                c.createdAt
            ),
          };
        })
      );

      setMessagesPaging((prev) => ({
        ...prev,
        [conversationId]: {
          page,
          totalPages: data.meta.totalPages,
          loading: false,
        },
      }));

      if (page === 1) shouldScrollRef.current = true;
      else {
        setTimeout(() => {
          if (scrollAreaRef.current)
            scrollAreaRef.current.scrollTop =
              scrollAreaRef.current.scrollHeight - prevScrollBottom;
        }, 0);
      }
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [currentConversation?.messages]);

  const handleSend = async () => {
    if (!currentConversation || sending || !messageInput.trim()) return;

    setSendError(null);
    const convoId = currentConversation.id;
    const tempId = `temp-${Date.now()}`;
    const userMessage: MessageView = {
      id: tempId,
      content: messageInput,
      role: "user",
      timestamp: new Date(),
      pending: true,
    };

    setConversations((prev) =>
      sortConversations(
        prev.map((c) =>
          c.id === convoId
            ? { ...c, messages: [...c.messages, userMessage] }
            : c
        )
      )
    );
    setAssistantTyping(true);
    setMessageInput("");
    shouldScrollRef.current = true;
    setSending(true);

    try {
      const resp = await apiSendMessage(convoId, {
        content: userMessage.content,
      });
      if (!resp?.userMessage || !resp?.assistantMessage) throw new Error();

      setSendError(null);
      setConversations((prev) =>
        sortConversations(
          prev.map((c) => {
            if (c.id !== convoId) return c;
            const messages = c.messages.filter((m) => m.id !== tempId);
            return {
              ...c,
              messages: [
                ...messages,
                {
                  id: resp.userMessage.id,
                  content: resp.userMessage.content,
                  role: resp.userMessage.role as "user" | "assistant",
                  timestamp: new Date(resp.userMessage.createdAt),
                },
                {
                  id: resp.assistantMessage.id,
                  content: resp.assistantMessage.content,
                  role: resp.assistantMessage.role as "user" | "assistant",
                  timestamp: new Date(resp.assistantMessage.createdAt),
                },
              ],
              lastMessageAt: new Date(resp.assistantMessage.createdAt),
            };
          })
        )
      );
    } catch (e) {
      console.error("Failed to send message", e);
      const apiMessage =
        e instanceof Error && e.message
          ? e.message
          : "Failed to communicate with LLM provider.";
      setSendError(apiMessage);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? { ...c, messages: c.messages.filter((m) => m.id !== tempId) }
            : c
        )
      );
      setMessageInput(userMessage.content);
    } finally {
      setAssistantTyping(false);
      setSending(false);
      shouldScrollRef.current = true;
    }
  };

  const handleCreateConversation = async () => {
    if (!newConversationTitle.trim() || !selectedAgentId) return;

    try {
      const created = await apiCreateConversation({
        title: newConversationTitle,
        agentId: selectedAgentId,
      });
      const mapped: ConversationView = {
        id: created.id,
        title: created.title,
        agentId: created.agentConfigurationId ?? created.agentId ?? "",
        createdAt: safeDate(created.createdAt),
        lastMessageAt: safeDate(created.lastMessageAt ?? created.createdAt),
        messages: [],
      };
      setConversations((prev) => sortConversations([mapped, ...prev]));
      setSelectedConversationId(mapped.id);
      setNewConversationTitle("");
      setConversationForm({ title: "" });
      setIsCreatingConversation(false);
    } catch (e) {
      console.error("Failed to create conversation", e);
    }
  };

  const loadMoreConversations = async () => {
    if (!hasMoreConversations || loadingConversations) return;
    const nextPage = conversationsPage + 1;
    setConversationsPage(nextPage);
    await loadConversations(selectedAgentId, nextPage);
  };

  const sortConversations = (list: ConversationView[]): ConversationView[] =>
    [...list].sort(
      (a, b) =>
        safeDate(b.lastMessageAt ?? b.createdAt).getTime() -
        safeDate(a.lastMessageAt ?? a.createdAt).getTime()
    );

  const ConversationButton = ({
    conversation,
  }: {
    conversation: ConversationView;
  }) => (
    <button
      key={conversation.id}
      onClick={() => handleSelectConversation(conversation.id)}
      className={cn(
        "w-full text-left p-3 rounded-lg transition-all border cursor-pointer",
        selectedConversationId === conversation.id
          ? "bg-blue-600 text-white border-blue-600 shadow-md"
          : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100 hover:border-blue-300"
      )}
    >
      <div className="font-medium text-sm truncate">{conversation.title}</div>
      <div
        className={cn(
          "text-xs mt-1",
          selectedConversationId === conversation.id
            ? "text-blue-100"
            : "text-gray-500"
        )}
      >
        {formatTime(conversation.lastMessageAt)}
      </div>
    </button>
  );

  const MessageBubble = ({ message }: { message: MessageView }) => (
    <div
      className={cn(
        "flex",
        message.role === "user" ? "justify-end" : "justify-start"
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
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            "text-xs mt-1",
            message.role === "user" ? "text-blue-100" : "text-gray-500"
          )}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );

  const handleSelectConversation = (conversationId: string) => {
    if (!conversationId || conversationId === selectedConversationId) return;
    setSelectedConversationId(conversationId);
    // Clear messages for a fresh fetch
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, messages: [] } : c))
    );
    setMessagesPaging((prev) => ({
      ...prev,
      [conversationId]: { page: 1, totalPages: 1, loading: true },
    }));
    void loadMessages(conversationId, 1);
  };

  return (
    <div className="h-[calc(100vh-82px)] bg-gray-50">
      <ResizablePanelGroup
        direction={stackedLayout ? "vertical" : "horizontal"}
      >
        {/* Conversations Panel */}
        <ResizablePanel
          defaultSize={stackedLayout ? 40 : 25}
          minSize={stackedLayout ? 30 : 20}
          maxSize={stackedLayout ? 70 : 35}
        >
          <div
            className={cn(
              "h-full flex flex-col bg-white",
              stackedLayout ? "border-b" : "border-r"
            )}
          >
            <div className="p-4 border-b space-y-3 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-gray-900">
                  Conversations
                </h2>
                <Button
                  size="sm"
                  onClick={() => setIsCreatingConversation(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              <Select
                value={selectedAgentId}
                onValueChange={setSelectedAgentId}
                disabled={agentsLoading}
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
                {loadingConversations ? (
                  <div className="flex justify-center py-6 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-sm text-gray-500">
                    <MessageSquare className="h-6 w-6 text-gray-400 mb-2" />
                    No conversations yet.
                  </div>
                ) : (
                  conversations.map((c) => (
                    <ConversationButton key={c.id} conversation={c} />
                  ))
                )}

                {hasMoreConversations && (
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                    onClick={loadMoreConversations}
                    disabled={loadingConversations}
                  >
                    {loadingConversations ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    )}
                    Load More Conversations
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Chat Panel */}
        <ResizablePanel defaultSize={stackedLayout ? 60 : 75}>
          <div className="h-full flex flex-col bg-white">
            {currentConversation ? (
              <>
                <div className="p-4 border-b bg-white">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {currentConversation.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Using {currentAgent?.title || "Unknown Agent"} •{" "}
                    {currentAgent
                      ? getLlmModelLabel(currentAgent.modelName ?? "")
                      : "—"}
                  </p>
                </div>

                <div
                  className="flex-1 overflow-y-auto p-4 bg-gray-50"
                  ref={scrollAreaRef}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (!currentConversation) return;
                    const paging = messagesPaging[currentConversation.id];
                    const isLoading = paging?.loading || loadingMessages;
                    const hasMore =
                      (paging?.page ?? 1) < (paging?.totalPages ?? 1);
                    if (target.scrollTop < 100 && hasMore && !isLoading) {
                      void loadMessages(
                        currentConversation.id,
                        (paging?.page ?? 1) + 1
                      );
                    }
                  }}
                >
                  <div className="space-y-4">
                    {(messagesPaging[currentConversation.id]?.loading ||
                      (loadingMessages &&
                        (messagesPaging[currentConversation.id]?.page ?? 1) ===
                          1)) && (
                      <div className="flex justify-center py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-full border shadow-sm">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          Loading messages...
                        </div>
                      </div>
                    )}

                    {currentConversation.messages.length === 0 &&
                    !loadingMessages ? (
                      <div className="flex justify-center py-10 text-sm text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      currentConversation.messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                      ))
                    )}

                    {sendError && (
                      <div className="flex justify-center">
                        <div className="bg-red-50 text-red-700 border border-red-200 shadow-sm max-w-[70%] rounded-2xl px-4 py-3 text-sm">
                          {sendError}
                        </div>
                      </div>
                    )}

                    {assistantTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border shadow-sm max-w-[70%] rounded-2xl px-4 py-3 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm">
                            Assistant is typing...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
                      disabled={loadingMessages}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={
                        !messageInput.trim() || sending || loadingMessages
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
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
