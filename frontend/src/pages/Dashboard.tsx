import { MessageSquare, Zap, Hash, Clock } from "lucide-react";
import { formatNumber, formatLatency } from "@/services/UtilityService";
import TotalMetricCard from "@/components/TotalMetricCard";
import BarChartCard from "@/components/BarChartCard";
import { useEffect, useState } from "react";
import { subscribeDashboardMetrics } from "@/services/SubscriptionService";
import type { DashboardMetrics } from "@/types/models/MetricsModel";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const { totals, agents } = metrics ?? {
    totals: {
      messageCount: 0,
      llmCalls: 0,
      totalTokens: 0,
      averageLatencyMs: 0,
      totalLatencyMs: 0,
    },
    agents: [],
  };

  useEffect(() => {
    const unsubscribe = subscribeDashboardMetrics({
      onMessage: (data) => {
        console.log(data);
        setMetrics(data as DashboardMetrics);
      },
      onError: (e: Event) => {
        console.error("Error subscribing to dashboard metrics", e);
      },
    });
    return () => unsubscribe();
  }, []);

  const animatedTotals = {
    messageCount: useAnimatedNumber(totals.messageCount),
    llmCalls: useAnimatedNumber(totals.llmCalls),
    totalTokens: useAnimatedNumber(totals.totalTokens),
    averageLatencyMs: useAnimatedNumber(totals.averageLatencyMs),
  };

  const roundAndFormat = (value: number) => formatNumber(Math.round(value));
  const roundLatency = (value: number) => formatLatency(Math.round(value));

  const totalMetricCards = [
    {
      title: "Total Messages",
      value: roundAndFormat(animatedTotals.messageCount),
      rawValue: totals.messageCount,
      icon: MessageSquare,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "LLM Calls",
      value: roundAndFormat(animatedTotals.llmCalls),
      rawValue: totals.llmCalls,
      icon: Zap,
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Total Tokens",
      value: roundAndFormat(animatedTotals.totalTokens),
      rawValue: totals.totalTokens,
      icon: Hash,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Avg Latency",
      value: roundLatency(animatedTotals.averageLatencyMs),
      rawValue: totals.averageLatencyMs,
      icon: Clock,
      gradient: "from-orange-500 to-orange-700",
    },
  ];

  const messagesChartData = agents.map((agent) => ({
    name: agent.agentName.split(" ")[0],
    value: agent.messageCount,
  }));

  const latencyChartData = agents.map((agent) => ({
    name: agent.agentName.split(" ")[0],
    value: agent.averageLatencyMs,
  }));

  const colors = ["#3b82f6", "#8b5cf6", "#6366f1", "#ec4899"];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Overview of agent performance and metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {totalMetricCards.map((metric) => (
          <TotalMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Messages by Agent"
          description="Total messages processed per agent"
          data={messagesChartData}
          barColors={colors}
          yTickFormatter={(value) => formatNumber(value)}
        />
        <BarChartCard
          title="Average Latency by Agent"
          description="Response time performance (ms)"
          data={latencyChartData}
          barColors={colors}
          yTickFormatter={(value) => `${value}ms`}
        />
      </div>
    </div>
  );
}
