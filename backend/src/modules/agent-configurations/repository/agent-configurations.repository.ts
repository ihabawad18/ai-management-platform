import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  AgentConfiguration,
  Prisma,
} from "../../../../generated/prisma/client";

@Injectable()
export class AgentConfigurationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AgentConfiguration[]> {
    return await this.prisma.agentConfiguration.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string): Promise<AgentConfiguration | null> {
    return await this.prisma.agentConfiguration.findUnique({ where: { id } });
  }

  async create(
    data: Prisma.AgentConfigurationCreateInput
  ): Promise<AgentConfiguration> {
    return await this.prisma.agentConfiguration.create({ data });
  }

  async update(
    id: string,
    data: Prisma.AgentConfigurationUpdateInput
  ): Promise<AgentConfiguration> {
    return await this.prisma.agentConfiguration.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<AgentConfiguration> {
    return await this.prisma.agentConfiguration.delete({ where: { id } });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.agentConfiguration.count({
      where: { id },
    });
    return count > 0;
  }
}
