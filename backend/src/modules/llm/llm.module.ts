import { Module } from "@nestjs/common";
import { LlmService } from "./service/llm.service";
import OpenAI from "openai";
import { LlmController } from "./llm.controller";

@Module({
  controllers: [LlmController],
  providers: [
    {
      provide: OpenAI,
      useFactory: () =>
        new OpenAI({
          apiKey: process.env.OPENAI_API_KEY!,
        }),
    },
    LlmService,
  ],
  exports: [LlmService],
})
export class LlmModule {}
