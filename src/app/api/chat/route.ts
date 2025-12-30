// src/app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { decrypt } from '@/lib/utils/encryption';
import { AIProvider } from '@/types';

// 服务端环境变量
const DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY;
const HTTPS_PROXY = process.env.HTTPS_PROXY;

// 动态创建代理 fetch（仅本地开发需要，Vercel 可直连）
async function createProxyFetch() {
  if (!HTTPS_PROXY) return undefined;

  try {
    const { ProxyAgent, fetch: undiciFetch } = await import('undici');
    const proxyAgent = new ProxyAgent(HTTPS_PROXY);
    return (url: string | URL | Request, init?: RequestInit) => {
      return undiciFetch(url as Parameters<typeof undiciFetch>[0], {
        ...init,
        dispatcher: proxyAgent,
      } as Parameters<typeof undiciFetch>[1]) as unknown as Promise<Response>;
    };
  } catch {
    return undefined;
  }
}

function getModel(
  provider: AIProvider,
  modelId: string,
  apiKey: string,
  proxyFetch?: (url: string | URL | Request, init?: RequestInit) => Promise<Response>
) {
  switch (provider) {
    case 'openai':
      return createOpenAI({
        apiKey,
        ...(proxyFetch && { fetch: proxyFetch }),
      })(modelId);

    case 'anthropic':
      return createAnthropic({
        apiKey,
        ...(proxyFetch && { fetch: proxyFetch }),
      })(modelId);

    case 'google': {
      const google = createGoogleGenerativeAI({
        apiKey,
        ...(proxyFetch && { fetch: proxyFetch }),
      });
      return google(modelId);
    }

    case 'deepseek':
      return createOpenAI({
        apiKey,
        baseURL: 'https://api.deepseek.com',
      }).chat(modelId);

    case 'qwen':
      return createOpenAI({
        apiKey,
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      }).chat(modelId);

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model, provider, encryptedApiKey } = body as {
      messages: UIMessage[];
      model: string;
      provider: AIProvider;
      encryptedApiKey?: string;
    };

    if (!messages || !model || !provider) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let apiKey: string | undefined;

    if (encryptedApiKey) {
      apiKey = decrypt(encryptedApiKey);
    }

    if (!apiKey && provider === 'google' && DEFAULT_GEMINI_KEY) {
      apiKey = DEFAULT_GEMINI_KEY;
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: `请配置 ${provider} 的 API Key` }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取代理 fetch（如果配置了代理）
    const proxyFetch = await createProxyFetch();

    const aiModel = getModel(provider, model, apiKey, proxyFetch);
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: aiModel,
      messages: modelMessages,
    });

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
