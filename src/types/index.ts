// src/types/index.ts
export type AIProvider = 'google' | 'openai' | 'anthropic' | 'deepseek' | 'qwen';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCalls?: ToolCall[];
  createdAt: Date;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderConfig {
  name: string;
  models: string[];
  baseUrl?: string;
}

export const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  google: {
    name: 'Google Gemini',
    models: [
      'gemini-2.5-flash',        // 免费
      'gemini-2.0-flash',        // 免费
      'gemini-2.5-pro',          // 付费
      'gemini-3-pro-preview',    // 付费
    ],
  },
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  },
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
    baseUrl: 'https://api.deepseek.com',
  },
  qwen: {
    name: 'Qwen',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  },
};

// 默认配置
export const DEFAULT_PROVIDER: AIProvider = 'google';
export const DEFAULT_MODEL = 'gemini-2.5-flash';
