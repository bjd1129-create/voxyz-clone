import { NextRequest } from 'next/server'

// 模拟等候列表存储
let waitlist: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // 简单的邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // 检查邮箱是否已在等候列表中
    if (waitlist.includes(email)) {
      return Response.json({ error: 'Email already registered' }, { status: 400 })
    }

    // 添加到等候列表
    waitlist.push(email)

    // 在实际应用中，这里会连接数据库或邮件服务
    console.log(`New waitlist registration: ${email}`)
    
    return Response.json({ success: true, message: 'Successfully added to waitlist' })
  } catch (error) {
    console.error('Waitlist registration error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 用于获取等候列表（仅用于开发测试）
export async function GET() {
  return Response.json({ count: waitlist.length, emails: waitlist })
}