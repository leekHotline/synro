// src/lib/services/userService.ts
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(email: string) {
  // 检查是否存在
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) {
    throw new Error('EMAIL_EXISTS');
  }

  // 创建用户
  const [user] = await db.insert(users).values({ email }).returning();
  return user;
}