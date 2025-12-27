import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  name: string;
  messages: string;
  llmCalls: string;
  tokens: string;
  avgLatency: string;
  accentClass: string;
};

const AgentStatCard = ({
  name,
  messages,
  llmCalls,
  tokens,
  avgLatency,
  accentClass,
}: Props) => (
  <Card className="border-2 hover:border-blue-200 hover:shadow-xl transition-all bg-white/80 backdrop-blur">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentClass}`} />
        {name}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Messages</span>
        <span className="text-sm font-bold text-blue-600">{messages}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">LLM Calls</span>
        <span className="text-sm font-bold text-emerald-600">{llmCalls}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Tokens</span>
        <span className="text-sm font-bold text-purple-600">{tokens}</span>
      </div>
      <div className="pt-2 border-t border-blue-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Avg Latency</span>
          <span className="text-sm font-bold text-orange-600">{avgLatency}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AgentStatCard;

