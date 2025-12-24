-- CreateEnum
CREATE TYPE "LlmModel" AS ENUM ('GPT_5_2', 'GPT_5_MINI', 'GPT_4_1', 'GPT_4O', 'GPT_5_NANO');

-- CreateTable
CREATE TABLE "agent_configurations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "system_prompt" TEXT NOT NULL,
    "model" "LlmModel" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_configurations_pkey" PRIMARY KEY ("id")
);
