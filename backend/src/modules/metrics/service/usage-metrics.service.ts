import { Injectable } from "@nestjs/common";
import { UsageMetricsRepository } from "../repository/usage-metrics.repository";
import {
  AgentMetricsDto,
  DashboardMetricsDto,
  TotalsMetricsDto,
} from "../dtos/dashboard-metrics.dto";
import type { AggregateUsageMetrics } from "generated/prisma/models";

@Injectable()
export class UsageMetricsService {
  constructor(
    private readonly usageMetricsRepository: UsageMetricsRepository
  ) {}

  async recordInteraction(params: {
    agentConfigurationId: string;
    messageCount?: number;
    llmCalls?: number;
    totalTokens?: number;
    totalLatencyMs?: number;
  }): Promise<void> {
    const {
      agentConfigurationId,
      messageCount = 0,
      llmCalls = 0,
      totalTokens = 0,
      totalLatencyMs = 0,
    } = params;

    await this.usageMetricsRepository.incrementForAgent(agentConfigurationId, {
      messageCount,
      llmCalls,
      totalTokens,
      totalLatencyMs,
    });
  }

  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const [totalsAgg, agentRows] = await Promise.all([
      this.usageMetricsRepository.aggregateTotals(),
      this.usageMetricsRepository.findAllWithAgent(),
    ]);

    const sum: AggregateUsageMetrics["_sum"] = totalsAgg._sum ?? {
      messageCount: 0,
      llmCalls: 0,
      totalTokens: 0,
      totalLatencyMs: 0,
    };
    const totalMessageCount = sum.messageCount ?? 0;
    const totalLlmCalls = sum.llmCalls ?? 0;
    const totalTokens = sum.totalTokens ?? 0;
    const totalLatencyMs = sum.totalLatencyMs ?? 0;

    const totals: TotalsMetricsDto = {
      messageCount: totalMessageCount,
      llmCalls: totalLlmCalls,
      totalTokens,
      totalLatencyMs,
      averageLatencyMs: totalLlmCalls > 0 ? totalLatencyMs / totalLlmCalls : 0,
    };

    const agents: AgentMetricsDto[] = agentRows.map((row) => ({
      agentId: row.agentConfiguration.id,
      agentName: row.agentConfiguration.name,
      messageCount: row.messageCount,
      llmCalls: row.llmCalls,
      totalTokens: row.totalTokens,
      totalLatencyMs: row.totalLatencyMs,
      averageLatencyMs:
        row.llmCalls > 0 ? row.totalLatencyMs / row.llmCalls : 0,
    }));

    return { totals, agents };
  }
}
