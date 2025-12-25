import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MessageService } from "./service/message.service";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { SendMessageResponseDto } from "./dtos/send-message-response.dto";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { MessagesPaginatedResponseDto } from "./dtos/messages-paginated-response.dto";

@ApiTags("Messages")
@Controller("/conversations/:conversationId")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post("/messages")
  @ApiOperation({
    summary: "Send a user message and receive an assistant reply",
    description:
      "Creates a new user message in a conversation and generates the assistant's response.",
  })
  @ApiOkResponse({
    description: "User and assistant messages created successfully",
    type: SendMessageResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Validation failed for the message content",
  })
  @ApiNotFoundResponse({
    description: "Conversation or related agent configuration not found",
  })
  @ApiInternalServerErrorResponse({
    description: "LLM provider failed to generate a response",
  })
  async createMessage(
    @Body() body: CreateMessageDto,
    @Param("conversationId") conversationId: string
  ): Promise<SendMessageResponseDto> {
    const result = await this.messageService.addNewMessage({
      conversationId,
      content: body.content,
    });
    return SendMessageResponseDto.fromEntities(
      result.userMessage,
      result.assistantMessage
    );
  }
  @Get("/messages")
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "pageSize", required: false, type: Number })
  @ApiOperation({
    summary: "List conversation messages",
    description:
      "Returns paginated messages for a conversation, ordered from newest to oldest.",
  })
  @ApiOkResponse({
    description: "Paginated list of messages",
    type: MessagesPaginatedResponseDto,
  })
  @ApiNotFoundResponse({
    description: "Conversation not found",
  })
  async getConversationMessages(
    @Param("conversationId") conversationId: string,
    @Query("page") page?: number,
    @Query("pageSize") pageSize?: number
  ): Promise<MessagesPaginatedResponseDto> {
    const messages = await this.messageService.getMessagesByConversationId(
      conversationId,
      page,
      pageSize
    );
    return MessagesPaginatedResponseDto.fromEntity(messages);
  }
}
