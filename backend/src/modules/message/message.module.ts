import { Module } from "@nestjs/common";
import { MessageService } from "./service/message.service";
import { MessageController } from "./message.controller";
import { MessageRepository } from "./repository/message.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { ConversationRepository } from "../conversation/repository/conversation.repository";
import { AgentConfigurationsRepository } from "../agent-configurations/repository/agent-configurations.repository";
import { LlmModule } from "../llm/llm.module";
import { MetricsModule } from "../metrics/metrics.module";

@Module({
  imports: [PrismaModule, LlmModule, MetricsModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository,
    ConversationRepository,
    AgentConfigurationsRepository,
  ],
})
export class MessageModule {}
