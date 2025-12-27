export const formatNumber = (num: number): string => {
  if (Number.isNaN(num)) return "0";
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

export const formatLatency = (ms: number): string => {
  if (Number.isNaN(ms)) return "0ms";
  return `${ms.toFixed(0)}ms`;
};

export const formatTime = (date: Date | string): string => {
  const parsed = typeof date === "string" ? new Date(date) : date;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
