import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // 使用 anon key 测试
  const anonClient = createClient(url, anonKey)
  const { data: anonData, error: anonError } = await anonClient.from('agents').select('id, name').limit(2)

  // 使用 service key 测试
  const serviceClient = createClient(url, serviceKey)
  const { data: serviceData, error: serviceError } = await serviceClient.from('agents').select('id, name').limit(2)

  return NextResponse.json({
    anonKeyTest: {
      success: !anonError,
      data: anonData,
      error: anonError?.message
    },
    serviceKeyTest: {
      success: !serviceError,
      data: serviceData,
      error: serviceError?.message
    }
  })
}