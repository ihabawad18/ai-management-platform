import { Controller, MessageEvent, Sse } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { interval, from, map, startWith, switchMap } from "rxjs";
import { UsageMetricsService } from "./service/usage-metrics.service";
import { DashboardMetricsDto } from "./dtos/dashboard-metrics.dto";

@Controller()
@ApiTags("Metrics")
export class MetricsController {
  constructor(private readonly usageMetricsService: UsageMetricsService) {}

  @Sse("/dashboard/metrics")
  @ApiOperation({
    summary: "Stream dashboard metrics",
    description:
      "Server-sent events stream of aggregated usage metrics and per-agent breakdowns.",
  })
  @ApiOkResponse({
    description: "SSE stream of dashboard metrics",
    type: DashboardMetricsDto,
    isArray: false,
  })
  getDashboardMetrics() {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => from(this.usageMetricsService.getDashboardMetrics())),
      map((data) => ({ data } as MessageEvent))
    );
  }
}
