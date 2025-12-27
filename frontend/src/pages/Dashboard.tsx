import { MessageSquare, Zap, Hash, Clock } from "lucide-react";
import { formatNumber, formatLatency } from "@/services/UtilityService";
import TotalMetricCard from "@/components/TotalMetricCard";
import BarChartCard from "@/components/BarChartCard";
import { useEffect, useMemo, useState } from "react";
import { subscribeDashboardMetrics } from "@/services/SubscriptionService";
import type { DashboardMetrics } from "@/types/models/Metrics.model";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

const EMPTY_TOTALS: DashboardMetrics["totals"] = {
  messageCount: 0,
  llmCalls: 0,
  totalTokens: 0,
  averageLatencyMs: 0,
  totalLatencyMs: 0,
};

const EMPTY_AGENTS: DashboardMetrics["agents"] = [];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const totals = metrics?.totals ?? EMPTY_TOTALS;
  const agents = metrics?.agents ?? EMPTY_AGENTS;

  useEffect(() => {
    const unsubscribe = subscribeDashboardMetrics({
      onMessage: (data) => {
        setMetrics(data as DashboardMetrics);
      },
      onError: (e) => {
        console.error("Dashboard SSE error", e);
      },
    });

    return () => unsubscribe();
  }, []);

  /* ------------------ animated totals ------------------ */
  const animatedTotals = {
    messageCount: useAnimatedNumber(totals.messageCount),
    llmCalls: useAnimatedNumber(totals.llmCalls),
    totalTokens: useAnimatedNumber(totals.totalTokens),
    averageLatencyMs: useAnimatedNumber(totals.averageLatencyMs),
  };

  const round = (v: number) => formatNumber(Math.round(v));
  const roundLatency = (v: number) => formatLatency(Math.round(v));

  /* ------------------ STABLE CHART DATA ------------------ */
  const messagesChartData = useMemo(() => {
    return agents.map((agent) => ({
      id: agent.agentId,
      name: (agent.agentName ?? agent.agentId).split(" ")[0],
      value: Number(agent.messageCount ?? 0),
    }));
  }, [agents]);

  const latencyChartData = useMemo(() => {
    return agents.map((agent) => ({
      id: agent.agentId,
      name: (agent.agentName ?? agent.agentId).split(" ")[0],
      value: Number(agent.averageLatencyMs ?? 0),
    }));
  }, [agents]);

  const colors = ["#3b82f6", "#8b5cf6", "#6366f1", "#ec4899"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview of agent performance and metrics
        </p>
      </div>

      {/* ---------- totals ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalMetricCard
          title="Total Messages"
          value={round(animatedTotals.messageCount)}
          icon={MessageSquare}
        />
        <TotalMetricCard
          title="LLM Calls"
          value={round(animatedTotals.llmCalls)}
          icon={Zap}
        />
        <TotalMetricCard
          title="Total Tokens"
          value={round(animatedTotals.totalTokens)}
          icon={Hash}
        />
        <TotalMetricCard
          title="Avg Latency"
          value={roundLatency(animatedTotals.averageLatencyMs)}
          icon={Clock}
        />
      </div>

      {/* ---------- charts ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          key={`messages-${messagesChartData.length}`}
          title="Messages by Agent"
          description="Total messages processed per agent"
          data={messagesChartData}
          barColors={colors}
          yTickFormatter={formatNumber}
        />

        <BarChartCard
          key={`latency-${latencyChartData.length}`}
          title="Average Latency by Agent"
          description="Response time performance (ms)"
          data={latencyChartData}
          barColors={colors}
          yTickFormatter={(v) => `${v}ms`}
        />
      </div>
    </div>
  );
}
