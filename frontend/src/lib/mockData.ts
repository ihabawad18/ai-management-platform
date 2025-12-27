import type { AgentConfig } from "@/types/models/AgentModel";
import type { Conversation } from "@/types/models/ConversationModel";
import type { DashboardMetrics } from "@/types/models/MetricsModel";

export const mockAgentConfigs: AgentConfig[] = [
  {
    id: "1",
    title: "Customer Support Agent",
    modelName: "gpt-4o",
    systemPrompt:
      "You are a helpful customer support agent. Be polite, professional, and solve customer issues efficiently.",
  },
  {
    id: "2",
    title: "Sales Assistant",
    modelName: "gpt-4o-mini",
    systemPrompt:
      "You are a sales assistant. Help customers find the right products and guide them through the purchase process.",
  },
  {
    id: "3",
    title: "Technical Support",
    modelName: "gpt-4-turbo",
    systemPrompt:
      "You are a technical support specialist. Provide detailed technical guidance and troubleshooting steps.",
  },
  {
    id: "4",
    title: "Content Writer",
    modelName: "gpt-4o",
    systemPrompt:
      "You are a creative content writer. Generate engaging, SEO-friendly content for various platforms.",
  },
  {
    id: "5",
    title: "Data Analyst Agent",
    modelName: "gpt-4o",
    systemPrompt:
      "You are a data analyst. Help users understand their data, create visualizations, and extract insights.",
  },
  {
    id: "6",
    title: "Code Review Assistant",
    modelName: "gpt-4-turbo",
    systemPrompt:
      "You are a code review specialist. Provide constructive feedback on code quality, best practices, and potential improvements.",
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totals: {
    messageCount: 15234,
    llmCalls: 8456,
    totalTokens: 2456789,
    totalLatencyMs: 425678,
    averageLatencyMs: 1245,
  },
  agents: [
    {
      agentId: "1",
      agentName: "Customer Support Agent",
      messageCount: 5678,
      llmCalls: 3245,
      totalTokens: 987654,
      totalLatencyMs: 156789,
      averageLatencyMs: 1156,
    },
    {
      agentId: "2",
      agentName: "Sales Assistant",
      messageCount: 4321,
      llmCalls: 2456,
      totalTokens: 765432,
      totalLatencyMs: 123456,
      averageLatencyMs: 1289,
    },
    {
      agentId: "3",
      agentName: "Technical Support",
      messageCount: 3890,
      llmCalls: 2134,
      totalTokens: 543210,
      totalLatencyMs: 98765,
      averageLatencyMs: 1367,
    },
    {
      agentId: "4",
      agentName: "Content Writer",
      messageCount: 1345,
      llmCalls: 621,
      totalTokens: 160493,
      totalLatencyMs: 46668,
      averageLatencyMs: 1124,
    },
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Product inquiry about pricing",
    agentId: "1",
    createdAt: new Date("2024-01-15T10:30:00"),
    messages: [
      {
        id: "m1",
        content: "What are your pricing plans?",
        role: "user",
        timestamp: new Date("2024-01-15T10:30:00"),
      },
      {
        id: "m2",
        content:
          "We offer three pricing tiers: Basic ($29/month), Professional ($79/month), and Enterprise (custom pricing). Each tier includes different features and support levels.",
        role: "assistant",
        timestamp: new Date("2024-01-15T10:30:15"),
      },
    ],
  },
  {
    id: "2",
    title: "Technical issue with API",
    agentId: "3",
    createdAt: new Date("2024-01-14T15:45:00"),
    messages: [
      {
        id: "m3",
        content: "I'm getting a 401 error when calling the API",
        role: "user",
        timestamp: new Date("2024-01-14T15:45:00"),
      },
      {
        id: "m4",
        content:
          "A 401 error indicates an authentication issue. Please check that your API key is correct and hasn't expired. Make sure you're including it in the Authorization header.",
        role: "assistant",
        timestamp: new Date("2024-01-14T15:45:20"),
      },
    ],
  },
  {
    id: "3",
    title: "Blog post ideas",
    agentId: "4",
    createdAt: new Date("2024-01-13T09:15:00"),
    messages: [
      {
        id: "m5",
        content: "I need 5 blog post ideas about AI in marketing",
        role: "user",
        timestamp: new Date("2024-01-13T09:15:00"),
      },
      {
        id: "m6",
        content:
          'Here are 5 compelling blog post ideas:\n\n1. "How AI is Revolutionizing Email Marketing Campaigns"\n2. "Personalization at Scale: AI-Powered Customer Segmentation"\n3. "The Future of Content Creation: AI Writing Tools vs Human Creativity"\n4. "Predictive Analytics: Using AI to Forecast Marketing Trends"\n5. "Chatbots and Conversational AI: Enhancing Customer Engagement"',
        role: "assistant",
        timestamp: new Date("2024-01-13T09:15:25"),
      },
    ],
  },
  {
    id: "4",
    title: "How to optimize database queries",
    agentId: "3",
    createdAt: new Date("2024-01-12T14:20:00"),
    messages: [
      {
        id: "m7",
        content: "My database queries are slow. How can I optimize them?",
        role: "user",
        timestamp: new Date("2024-01-12T14:20:00"),
      },
      {
        id: "m8",
        content:
          "Here are key optimization strategies:\n\n1. Add proper indexes on frequently queried columns\n2. Use EXPLAIN to analyze query execution\n3. Avoid SELECT * - only fetch needed columns\n4. Implement query caching where appropriate\n5. Consider database connection pooling",
        role: "assistant",
        timestamp: new Date("2024-01-12T14:20:30"),
      },
    ],
  },
  {
    id: "5",
    title: "Refund request assistance",
    agentId: "1",
    createdAt: new Date("2024-01-11T11:10:00"),
    messages: [
      {
        id: "m9",
        content: "I would like to request a refund for my recent purchase",
        role: "user",
        timestamp: new Date("2024-01-11T11:10:00"),
      },
      {
        id: "m10",
        content:
          "I'd be happy to help you with your refund request. To process this, I'll need your order number and the reason for the refund. Our refund policy allows returns within 30 days of purchase.",
        role: "assistant",
        timestamp: new Date("2024-01-11T11:10:20"),
      },
    ],
  },
  {
    id: "6",
    title: "Sales demo scheduling",
    agentId: "2",
    createdAt: new Date("2024-01-10T09:30:00"),
    messages: [
      {
        id: "m11",
        content: "Can I schedule a demo of your platform?",
        role: "user",
        timestamp: new Date("2024-01-10T09:30:00"),
      },
      {
        id: "m12",
        content:
          "Absolutely! I'd love to show you our platform. We have demo slots available this week. What day and time works best for you? Our demos typically last 30-45 minutes.",
        role: "assistant",
        timestamp: new Date("2024-01-10T09:30:25"),
      },
    ],
  },
  {
    id: "7",
    title: "SEO optimization tips",
    agentId: "4",
    createdAt: new Date("2024-01-09T16:45:00"),
    messages: [
      {
        id: "m13",
        content: "What are the best SEO practices for 2024?",
        role: "user",
        timestamp: new Date("2024-01-09T16:45:00"),
      },
      {
        id: "m14",
        content:
          "Here are top SEO practices for 2024:\n\n1. Focus on E-E-A-T (Experience, Expertise, Authoritativeness, Trust)\n2. Optimize for Core Web Vitals\n3. Create quality, in-depth content\n4. Build authoritative backlinks\n5. Optimize for mobile-first indexing\n6. Use structured data markup",
        role: "assistant",
        timestamp: new Date("2024-01-09T16:45:35"),
      },
    ],
  },
  {
    id: "8",
    title: "Data visualization recommendations",
    agentId: "5",
    createdAt: new Date("2024-01-08T13:00:00"),
    messages: [
      {
        id: "m15",
        content: "What's the best way to visualize quarterly sales data?",
        role: "user",
        timestamp: new Date("2024-01-08T13:00:00"),
      },
      {
        id: "m16",
        content:
          "For quarterly sales data, I recommend:\n\n1. Bar charts for comparing quarters\n2. Line charts to show trends over time\n3. Stacked bar charts for product category breakdowns\n4. Heat maps for regional performance\n\nThe choice depends on what insights you want to highlight.",
        role: "assistant",
        timestamp: new Date("2024-01-08T13:00:40"),
      },
    ],
  },
];
