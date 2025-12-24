import { Module } from "@nestjs/common";
import { AgentConfigurationsController } from "./agent-configurations.controller";
import { AgentConfigurationsService } from "./service/agent-configurations.service";
import { AgentConfigurationsRepository } from "./repository/agent-configurations.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [AgentConfigurationsController],
  providers: [AgentConfigurationsService, AgentConfigurationsRepository],
})
export class AgentConfigurationsModule {}
