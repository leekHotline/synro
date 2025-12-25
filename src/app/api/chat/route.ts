// src/app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { decrypt } from '@/lib/utils/encryption';
import { AIProvider } from '@/types';

export const runtime = 'edge';

// 创建模型实例
function getModel(provider: AIProvider, modelId: string, apiKey: string) {
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey })(modelId);
    case 'anthropic':
      return createAnthropic({ apiKey })(modelId);
    case 'google':
      return createGoogleGenerativeAI({ apiKey })(modelId);
    case 'deepseek':
      return createOpenAI({ apiKey, baseURL: 'https://api.deepseek.com' })(modelId);
    case 'qwen':
      return createOpenAI({ apiKey, baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1' })(modelId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// 定义工具
const tools = {
  getCurrentTime: tool({
    description: 'Get the current date and time',
    parameters: z.object({
      timezone: z.string().optional().describe('Timezone like Asia/Shanghai'),
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
  calculate: tool({
    description: 'Perform mathematical calculations',
    parameters: z.object({
      expression: z.string().describe('Math expression to evaluate'),
    }),
    execute: async ({ expression }) => {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
        const result = Function(`"use strict"; return (${sanitized})`)();
        return { expression, result };
      } catch {
        return { expression, error: 'Invalid expression' };
      }
    },
  }),
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model, provider, encryptedApiKey } = body as {
      messages: UIMessage[];
      model: string;
      provider: AIProvider;
      encryptedApiKey: string;
    };

    // 验证参数
    if (!messages || !model || !provider || !encryptedApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 解密 API Key
    const apiKey = decrypt(encryptedApiKey);
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取模型
    const aiModel = getModel(provider, model, apiKey);

    // ✅ AI SDK 6.0 语法
    const result = streamText({
      model: aiModel,
      messages: await convertToModelMessages(messages),
      tools,
    });

    // ✅ 返回 UI 消息流响应
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request', details: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}