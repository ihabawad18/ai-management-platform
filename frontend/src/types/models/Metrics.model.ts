export interface AgentMetrics {
  agentId: string;
  agentName: string;
  messageCount: number;
  llmCalls: number;
  totalTokens: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
}

export interface TotalsMetrics {
  messageCount: number;
  llmCalls: number;
  totalTokens: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
}

export interface DashboardMetrics {
  totals: TotalsMetrics;
  agents: AgentMetrics[];
}

