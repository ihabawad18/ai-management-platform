import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { MetricsController } from "./metrics.controller";
import { UsageMetricsRepository } from "./repository/usage-metrics.repository";
import { UsageMetricsService } from "./service/usage-metrics.service";

@Module({
  imports: [PrismaModule],
  controllers: [MetricsController],
  providers: [UsageMetricsRepository, UsageMetricsService],
  exports: [UsageMetricsService],
})
export class MetricsModule {}
