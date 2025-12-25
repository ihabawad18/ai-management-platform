import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { Prisma } from "../../../../generated/prisma/client";

export type UsageMetricsWithAgent = {
  id: string;
  agentConfigurationId: string;
  messageCount: number;
  llmCalls: number;
  totalTokens: number;
  totalLatencyMs: number;
  updatedAt: Date;
  agentConfiguration: { id: string; name: string };
};

type AggregateTotals = Prisma.GetUsageMetricsAggregateType<{
  _sum: {
    messageCount: true;
    llmCalls: true;
    totalTokens: true;
    totalLatencyMs: true;
  };
}>;

@Injectable()
export class UsageMetricsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async incrementForAgent(
    agentConfigurationId: string,
    delta: {
      messageCount?: number;
      llmCalls?: number;
      totalTokens?: number;
      totalLatencyMs?: number;
    }
  ): Promise<UsageMetricsWithAgent> {
    const messageCount = delta.messageCount ?? 0;
    const llmCalls = delta.llmCalls ?? 0;
    const totalTokens = delta.totalTokens ?? 0;
    const totalLatencyMs = delta.totalLatencyMs ?? 0;

    const usageMetrics = await this.prisma.usageMetrics.upsert({
      where: { agentConfigurationId },
      create: {
        agentConfigurationId,
        messageCount,
        llmCalls,
        totalTokens,
        totalLatencyMs,
      },
      update: {
        messageCount: { increment: messageCount },
        llmCalls: { increment: llmCalls },
        totalTokens: { increment: totalTokens },
        totalLatencyMs: { increment: totalLatencyMs },
      },
    });

    const agentConfiguration = await this.prisma.agentConfiguration.findUnique({
      where: { id: agentConfigurationId },
      select: { id: true, name: true },
    });

    if (!agentConfiguration) {
      throw new Error(
        `AgentConfiguration with id ${agentConfigurationId} not found`
      );
    }

    return {
      ...usageMetrics,
      agentConfiguration,
    };
  }

  async aggregateTotals(): Promise<AggregateTotals> {
    return await this.prisma.usageMetrics.aggregate({
      _sum: {
        messageCount: true,
        llmCalls: true,
        totalTokens: true,
        totalLatencyMs: true,
      },
    });
  }

  async findAllWithAgent(): Promise<UsageMetricsWithAgent[]> {
    return await this.prisma.usageMetrics.findMany({
      include: {
        agentConfiguration: {
          select: { id: true, name: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}
