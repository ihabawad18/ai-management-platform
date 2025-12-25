import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ConversationService } from "./service/conversation.service";
import { ConversationResponseDto } from "./dtos/conversation-response.dto";
import { CreateConversationDto } from "./dtos/create-conversation.dto";
import { ConversationsPaginatedResponseDto } from "./dtos/conversations-response.dto";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Conversations")
@Controller("")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Get("/agents/:agentId/conversations")
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "pageSize", required: false, type: Number })
  @ApiOperation({
    summary: "List conversations for an agent configuration",
    description:
      "Returns paginated conversations for a given agent configuration, ordered by latest message.",
  })
  @ApiOkResponse({
    description: "Paginated conversations returned successfully",
    type: ConversationsPaginatedResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Agent configuration not found",
  })
  async getConversationsByAgentConfiguration(
    @Param("agentId") agentId: string,
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number
  ): Promise<ConversationsPaginatedResponseDto> {
    const conversations =
      await this.conversationService.getAllPaginatedConversationsByAgentConfiguration(
        agentId,
        page,
        pageSize
      );
    return ConversationsPaginatedResponseDto.fromEntity(conversations);
  }
  @Post("/conversations")
  @ApiOperation({
    summary: "Create a new conversation",
    description: "Creates a conversation linked to the specified agent.",
  })
  @ApiOkResponse({
    description: "Conversation created successfully",
    type: ConversationResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Validation failed for conversation creation",
  })
  @ApiNotFoundResponse({
    description: "Agent configuration not found",
  })
  async createConversation(
    @Body() body: CreateConversationDto
  ): Promise<ConversationResponseDto> {
    const conversation =
      await this.conversationService.createNewConversation(body);
    return ConversationResponseDto.fromEntity(conversation);
  }
}
