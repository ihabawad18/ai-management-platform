import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {
  @ApiProperty({
    description: "Content of the user message",
    example: "Hello, how can you assist me?",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
