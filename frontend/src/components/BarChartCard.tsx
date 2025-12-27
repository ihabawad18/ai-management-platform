import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type DataPoint = { id?: string; name: string; value: number };

type Props = {
  title: string;
  description: string;
  data: DataPoint[];
  barColors: string[];
  yTickFormatter?: (value: number) => string;
};

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

export default function BarChartCard({
  title,
  description,
  data,
  barColors,
  yTickFormatter,
}: Props) {
  const chartData: ChartData<"bar", number[], string> = useMemo(() => {
    const labels = data.map((d) => d.name);
    const values = data.map((d) => d.value);
    return {
      labels,
      datasets: [
        {
          label: description,
          data: values,
          backgroundColor: labels.map(
            (_: string, idx: number) => barColors[idx % barColors.length]
          ),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }, [data, barColors, description]);

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const value =
                typeof ctx.parsed.y === "number" ? ctx.parsed.y : ctx.parsed;
              const rounded =
                typeof value === "number" ? Math.round(value) : value;
              return yTickFormatter
                ? yTickFormatter(rounded as number)
                : String(rounded);
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0, minRotation: 0, font: { size: 12 } },
        },
        y: {
          grid: { color: "rgba(0,0,0,0.05)" },
          ticks: {
            callback: function (val: string | number) {
              const num = Number(val);
              return yTickFormatter ? yTickFormatter(num) : String(val);
            },
            font: { size: 11 },
          },
        },
      },
    }),
    [yTickFormatter]
  );

  return (
    <Card className="border-2 bg-white min-w-0">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-500">
            Waiting for data…
          </div>
        ) : (
          <div className="h-64 min-h-[240px] w-full min-w-0">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
