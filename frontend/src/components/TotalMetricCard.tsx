import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";

type Props = {
  title: string;
  value: string;
  icon: LucideIcon;
};

const TotalMetricCard = ({ title, value, icon: Icon }: Props) => (
  <Card className="overflow-hidden border transition-all hover:shadow-lg bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
        {title}
        <Icon className="h-5 w-5 text-gray-400" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center text-xs text-gray-500">
          <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
          <span>All agents</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TotalMetricCard;

