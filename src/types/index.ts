// src/types/index.ts
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'qwen';

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
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  },
  google: {
    name: 'Google',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
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