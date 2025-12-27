import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type DataPoint = { name: string; value: number };

type Props = {
  title: string;
  description: string;
  data: DataPoint[];
  barColors: string[];
  valueFormatter?: (value: number) => string;
  yTickFormatter?: (value: number) => string;
};

const defaultFormatter = (value: number) => value.toString();

const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value: number }>;
  label?: string | number;
  formatter?: (v: number) => string;
}) => {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const formattedValue = formatter ? formatter(value) : value;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-900/10">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-slate-900">
        {formattedValue}
      </div>
    </div>
  );
};

const BarChartCard = ({
  title,
  description,
  data,
  barColors,
  valueFormatter,
  yTickFormatter,
}: Props) => (
  <Card className="border-2 bg-white/80 backdrop-blur">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={yTickFormatter ?? defaultFormatter}
          />
          <Tooltip
            cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
            content={(props) => (
              <CustomTooltip
                {...props}
                formatter={valueFormatter ?? defaultFormatter}
              />
            )}
            wrapperStyle={{ outline: "none" }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={barColors[index % barColors.length]}
                className="transition-all duration-200 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default BarChartCard;
