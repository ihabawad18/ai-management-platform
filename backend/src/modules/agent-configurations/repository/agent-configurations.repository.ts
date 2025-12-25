import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  AgentConfiguration,
  Prisma,
} from "../../../../generated/prisma/client";

type AgentDelegate = Prisma.AgentConfigurationDelegate;

@Injectable()
export class AgentConfigurationsRepository extends BaseRepository<
  AgentConfiguration,
  AgentDelegate
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  protected get model(): AgentDelegate {
    return this.prisma.agentConfiguration;
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }
}
