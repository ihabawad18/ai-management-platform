import { ApiProperty } from "@nestjs/swagger";

export class AgentMetricsDto {
  @ApiProperty({ description: "Agent configuration ID" })
  agentId: string;

  @ApiProperty({ description: "Agent name" })
  agentName: string;

  @ApiProperty({ description: "Total messages processed by this agent" })
  messageCount: number;

  @ApiProperty({ description: "Total LLM calls made by this agent" })
  llmCalls: number;

  @ApiProperty({ description: "Total tokens consumed by this agent" })
  totalTokens: number;

  @ApiProperty({ description: "Sum of latencies for this agent in ms" })
  totalLatencyMs: number;

  @ApiProperty({ description: "Average latency per LLM call in ms" })
  averageLatencyMs: number;
}

export class TotalsMetricsDto {
  @ApiProperty({ description: "Total messages processed across all agents" })
  messageCount: number;

  @ApiProperty({ description: "Total LLM calls across all agents" })
  llmCalls: number;

  @ApiProperty({ description: "Total tokens consumed across all agents" })
  totalTokens: number;

  @ApiProperty({ description: "Sum of latencies across all agents in ms" })
  totalLatencyMs: number;

  @ApiProperty({ description: "Average latency per LLM call across all agents" })
  averageLatencyMs: number;
}

export class DashboardMetricsDto {
  @ApiProperty({ type: TotalsMetricsDto })
  totals: TotalsMetricsDto;

  @ApiProperty({ type: [AgentMetricsDto] })
  agents: AgentMetricsDto[];
}
