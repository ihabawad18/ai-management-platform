import { Test, TestingModule } from "@nestjs/testing";
import { LlmService } from "./llm.service";
import OpenAI from "openai";
import { LlmModel } from "../enums/llm-model.enum";

describe("LlmService", () => {
  let service: LlmService;
  let openai: jest.Mocked<OpenAI>;

  beforeEach(async () => {
    const openAiMock = {
      responses: {
        create: jest.fn(),
      },
    } as unknown as jest.Mocked<OpenAI>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: OpenAI,
          useValue: openAiMock,
        },
      ],
    }).compile();

    service = module.get(LlmService);
    openai = module.get(OpenAI);
  });

  it("should return LLM response content", async () => {
    (openai.responses.create as jest.Mock).mockResolvedValue({
      output_text: "Hello from mock LLM",
    });

    const result = await service.generateResponse({
      systemPrompt: "You are helpful",
      userMessage: "Hello",
      model: LlmModel.GPT_5_2,
    });

    expect(result).toEqual({ output_text: "Hello from mock LLM" });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(openai.responses.create).toHaveBeenCalled();
  });
});
