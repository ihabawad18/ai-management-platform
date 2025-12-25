import { Module } from "@nestjs/common";
import { ConversationService } from "./service/conversation.service";
import { ConversationController } from "./conversation.controller";
import { ConversationRepository } from "./repository/conversation.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
})
export class ConversationModule {}
