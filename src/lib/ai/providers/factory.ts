// src/lib/ai/providers/factory.ts
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { AIProvider } from '@/types';

export function createProvider(provider: AIProvider, apiKey: string) {
  switch (provider) {
    case 'openai':
      return createOpenAI({ apiKey });

    case 'anthropic':
      return createAnthropic({ apiKey });

    case 'google':
      return createGoogleGenerativeAI({ apiKey });

    case 'deepseek':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com',
      });

    case 'qwen':
      return createOpenAI({
        apiKey,
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      });

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export function getModel(provider: AIProvider, modelId: string, apiKey: string) {
  const client = createProvider(provider, apiKey);
  return client(modelId);
}