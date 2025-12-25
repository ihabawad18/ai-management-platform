import { Module } from "@nestjs/common";
import { LlmService } from "./service/llm.service";
import OpenAI from "openai";

@Module({
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
