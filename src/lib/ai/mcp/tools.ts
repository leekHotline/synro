// src/lib/ai/mcp/tools.ts
import { tool } from 'ai';
import { z } from 'zod';

export const mcpTools = {
  // 获取当前时间
  getCurrentTime: tool({
    description: 'Get the current date and time',
    parameters: z.object({
      timezone: z.string().optional().describe('Timezone, e.g., Asia/Shanghai'),
    }),
    execute: async ({ timezone = 'UTC' }) => {
      const now = new Date();
      return {
        time: now.toLocaleString('en-US', { timeZone: timezone }),
        timezone,
        timestamp: now.toISOString(),
      };
    },
  }),

  // 计算器
  calculate: tool({
    description: 'Perform mathematical calculations',
    parameters: z.object({
      expression: z.string().describe('Mathematical expression to evaluate'),
    }),
    execute: async ({ expression }) => {
      try {
        // 安全的数学表达式计算
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
        const result = Function(`"use strict"; return (${sanitized})`)();
        return { expression, result };
      } catch {
        return { expression, error: 'Invalid expression' };
      }
    },
  }),

  // 网络搜索（模拟）
  webSearch: tool({
    description: 'Search the web for information',
    parameters: z.object({
      query: z.string().describe('Search query'),
      limit: z.number().optional().default(5),
    }),
    execute: async ({ query, limit }) => {
      // 这里可以集成真实的搜索 API
      return {
        query,
        message: 'Web search is a placeholder. Integrate with a real search API.',
        results: [],
      };
    },
  }),
};