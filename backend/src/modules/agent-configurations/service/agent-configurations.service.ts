import { Injectable, NotFoundException } from "@nestjs/common";
import { AgentConfigurationsRepository } from "../repository/agent-configurations.repository";
import { CreateAgentConfigurationDto } from "../dtos/create-agent-configuration.dto";
import { UpdateAgentConfigurationDto } from "../dtos/update-agent-configuration.dto";
import type { AgentConfiguration } from "../../../../generated/prisma/client";

@Injectable()
export class AgentConfigurationsService {
  constructor(private readonly repo: AgentConfigurationsRepository) {}

  async list(): Promise<AgentConfiguration[]> {
    return this.repo.findAll({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getById(id: string): Promise<AgentConfiguration> {
    const config = await this.repo.findById(id);

    if (!config) {
      throw new NotFoundException(`Agent configuration ${id} not found`);
    }

    return config;
  }

  async create(dto: CreateAgentConfigurationDto): Promise<AgentConfiguration> {
    return this.repo.create({
      name: dto.name,
      systemPrompt: dto.systemPrompt,
      model: dto.model,
    });
  }

  async updateById(
    id: string,
    dto: UpdateAgentConfigurationDto
  ): Promise<AgentConfiguration> {
    // Ensure record exists
    const exists = await this.repo.existsById(id);

    if (!exists) {
      throw new NotFoundException(`Agent configuration ${id} not found`);
    }
    return this.repo.update(id, dto);
  }

  async deleteById(id: string): Promise<AgentConfiguration> {
    // Ensure record exists
    const exists = await this.repo.existsById(id);

    if (!exists) {
      throw new NotFoundException(`Agent configuration ${id} not found`);
    }

    return this.repo.delete(id);
  }
}
