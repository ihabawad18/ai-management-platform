import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateConversationDto {
  @ApiProperty({
    description: "Agent Configuration ID associated with the conversation",
    example: "agent-12345",
  })
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @ApiProperty({
    description: "Title of the conversation",
    example: "Customer Support",
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
