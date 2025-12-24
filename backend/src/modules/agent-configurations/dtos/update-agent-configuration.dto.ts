import { PartialType } from "@nestjs/swagger";
import { CreateAgentConfigurationDto } from "./create-agent-configuration.dto";

export class UpdateAgentConfigurationDto extends PartialType(
  CreateAgentConfigurationDto
) {}
