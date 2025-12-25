import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateAgentConfigurationDto } from "./dtos/create-agent-configuration.dto";
import { UpdateAgentConfigurationDto } from "./dtos/update-agent-configuration.dto";
import { AgentConfigurationsService } from "./service/agent-configurations.service";
import { AgentConfigurationResponseDto } from "./dtos/agent-configuration-response.dto";

@Controller("agent-configurations")
@ApiTags("Agent Configurations")
export class AgentConfigurationsController {
  constructor(
    private readonly agentConfigurationsService: AgentConfigurationsService
  ) {}

  @Get()
  @ApiOperation({ summary: "List all agent configurations" })
  @ApiOkResponse({
    description: "Array of agent configurations",
    type: AgentConfigurationResponseDto,
    isArray: true,
  })
  async findAll(): Promise<AgentConfigurationResponseDto[]> {
    const configs = await this.agentConfigurationsService.list();
    return AgentConfigurationResponseDto.fromEntities(configs);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single agent configuration by id" })
  @ApiOkResponse({
    description: "Agent configuration",
    type: AgentConfigurationResponseDto,
  })
  @ApiNotFoundResponse({ description: "Agent configuration not found" })
  async findOne(
    @Param("id") id: string
  ): Promise<AgentConfigurationResponseDto> {
    const config = await this.agentConfigurationsService.getById(id);
    return AgentConfigurationResponseDto.fromEntity(config);
  }

  @Post()
  @ApiOperation({ summary: "Create a new agent configuration" })
  @ApiCreatedResponse({
    description: "Created agent configuration",
    type: AgentConfigurationResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Bad Request: Validation failed for creation",
  })
  async create(
    @Body() dto: CreateAgentConfigurationDto
  ): Promise<AgentConfigurationResponseDto> {
    const created = await this.agentConfigurationsService.create(dto);
    return AgentConfigurationResponseDto.fromEntity(created);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an existing agent configuration" })
  @ApiOkResponse({
    description: "Updated agent configuration",
    type: AgentConfigurationResponseDto,
  })
  @ApiNotFoundResponse({ description: "Agent configuration not found" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateAgentConfigurationDto
  ): Promise<AgentConfigurationResponseDto> {
    const updated = await this.agentConfigurationsService.updateById(id, dto);
    return AgentConfigurationResponseDto.fromEntity(updated);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an agent configuration" })
  @ApiOkResponse({
    description: "Deleted agent configuration",
    type: AgentConfigurationResponseDto,
  })
  @ApiNotFoundResponse({ description: "Agent configuration not found" })
  async remove(@Param("id") id: string): Promise<null> {
    await this.agentConfigurationsService.deleteById(id);
    return null;
  }
}
