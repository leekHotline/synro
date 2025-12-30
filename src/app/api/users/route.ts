import {db} from '@/lib/db'

import {users} from '@/lib/db/schema'

import { eq } from 'drizzle-orm'

import { NextResponse,NextRequest } from 'next/server'

import {createUser} from '@/lib/services/userService'
import { error } from 'console'

// 吐槽接口 不用装饰器用方法名缺失含义 db操作不能写在路由层
export async function POST(request:NextRequest){
    try {
        // 解析请求体
        const {email}  = await request.json()

        // 校验用户是否存在 对应邮箱有没有 先简单校验一下字段
        if (!email || typeof email !== 'string') {
            return NextResponse.json({error: 'Invalid email'}, {status: 400});
        }

        // 插入用户
        const user = await createUser(email)

        // 返回响应
        return NextResponse.json(
            user, {status: 200}
        );

        // 报错处理

        
    }catch(error) {
        return NextResponse.json(
            {error:"register error"},
            {status: 501}
        )
    }
}