-- CreateTable
CREATE TABLE "usage_metrics" (
    "id" TEXT NOT NULL,
    "agent_configuration_id" TEXT NOT NULL,
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "llm_calls" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_latency_ms" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usage_metrics_agent_configuration_id_key" ON "usage_metrics"("agent_configuration_id");

-- CreateIndex
CREATE INDEX "idx_usage_metrics_agent_configuration_id" ON "usage_metrics"("agent_configuration_id");

-- AddForeignKey
ALTER TABLE "usage_metrics" ADD CONSTRAINT "usage_metrics_agent_configuration_id_fkey" FOREIGN KEY ("agent_configuration_id") REFERENCES "agent_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
