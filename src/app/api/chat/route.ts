// src/app/api/chat/route.ts
import { streamText, convertToCoreMessages } from 'ai';
import { getModel } from '@/lib/ai/providers/factory';
import { mcpTools } from '@/lib/ai/mcp/tools';
import { db, messages as messagesTable, conversations } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { decrypt } from '@/lib/utils/encryption';
import { AIProvider } from '@/types';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, model, provider, conversationId, encryptedApiKey } = await req.json();

    // 解密 API Key
    const apiKey = decrypt(encryptedApiKey);

    // 获取模型实例
    const aiModel = getModel(provider as AIProvider, model, apiKey);

    // 流式响应
    const result = await streamText({
      model: aiModel,
      messages: convertToCoreMessages(messages),
      tools: mcpTools,
      maxSteps: 5, // 允许多步工具调用
      onFinish: async ({ text, toolCalls }) => {
        // 保存消息到数据库
        if (conversationId) {
          await db.insert(messagesTable).values({
            conversationId,
            role: 'assistant',
            content: text,
            toolCalls: toolCalls?.length ? toolCalls : null,
          });

          // 更新会话时间
          await db
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, conversationId));
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}