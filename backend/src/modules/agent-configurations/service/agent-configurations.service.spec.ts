/* eslint-disable @typescript-eslint/unbound-method */

import { prismaMock } from "./../../../../test/mocks/prisma.mock";
import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { AgentConfigurationsService } from "./agent-configurations.service";
import { AgentConfigurationsRepository } from "../repository/agent-configurations.repository";
import { CreateAgentConfigurationDto } from "../dtos/create-agent-configuration.dto";
import { UpdateAgentConfigurationDto } from "../dtos/update-agent-configuration.dto";
import type { AgentConfiguration } from "../../../../generated/prisma/client";

const mockAgent: AgentConfiguration = {
  id: "cfg_1",
  name: "Test Agent",
  systemPrompt: "Be helpful",
  model: "GPT_5_2",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-02T00:00:00.000Z"),
};
jest.mock("../../prisma/prisma.service", () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    prismaMock,
  })),
}));

describe("AgentConfigurationsService", () => {
  let service: AgentConfigurationsService;
  let repo: jest.Mocked<AgentConfigurationsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentConfigurationsService,
        {
          provide: AgentConfigurationsRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockAgent]),
            findById: jest.fn().mockResolvedValue(mockAgent),
            create: jest.fn().mockResolvedValue(mockAgent),
            update: jest.fn().mockResolvedValue(mockAgent),
            delete: jest.fn().mockResolvedValue(mockAgent),
            existsById: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<AgentConfigurationsService>(
      AgentConfigurationsService
    );
    repo = module.get(AgentConfigurationsRepository);
  });

  it("list returns all agents", async function (this: void) {
    const result = await service.list();
    expect(repo.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockAgent]);
  });

  it("getById returns agent", async () => {
    const result = await service.getById("cfg_1");
    expect(repo.findById).toHaveBeenCalledWith("cfg_1");
    expect(result).toEqual(mockAgent);
  });

  it("getById throws when not found", async () => {
    repo.findById.mockResolvedValueOnce(null);
    await expect(service.getById("missing")).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it("create passes dto to repo", async () => {
    const dto: CreateAgentConfigurationDto = {
      name: "New",
      systemPrompt: "Prompt",
      model: "GPT_5_2",
    };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockAgent);
  });

  it("updateById updates when exists", async () => {
    const dto: UpdateAgentConfigurationDto = { name: "Updated" };
    const result = await service.updateById("cfg_1", dto);
    expect(repo.existsById).toHaveBeenCalledWith("cfg_1");
    expect(repo.update).toHaveBeenCalledWith("cfg_1", dto);
    expect(result).toEqual(mockAgent);
  });

  it("updateById throws when not found", async () => {
    repo.existsById.mockResolvedValueOnce(false);
    await expect(
      service.updateById("missing", { name: "Updated" })
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("deleteById deletes when exists", async () => {
    const result = await service.deleteById("cfg_1");
    expect(repo.existsById).toHaveBeenCalledWith("cfg_1");
    expect(repo.delete).toHaveBeenCalledWith("cfg_1");
    expect(result).toEqual(mockAgent);
  });

  it("deleteById throws when not found", async () => {
    repo.existsById.mockResolvedValueOnce(false);
    await expect(service.deleteById("missing")).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});
