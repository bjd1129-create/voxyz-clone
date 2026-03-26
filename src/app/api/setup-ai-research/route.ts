import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const sb = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS ai_research_reports (
  id VARCHAR(100) PRIMARY KEY,
  title TEXT NOT NULL,
  theme VARCHAR(50) NOT NULL,
  focus TEXT,
  keywords TEXT[],
  regions TEXT[],
  content JSONB,
  status VARCHAR(20) DEFAULT 'draft',
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_research_theme ON ai_research_reports(theme);
CREATE INDEX IF NOT EXISTS idx_ai_research_created_at ON ai_research_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_research_status ON ai_research_reports(status);

ALTER TABLE ai_research_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for all" ON ai_research_reports FOR SELECT USING (true);
CREATE POLICY "Allow write for service_role" ON ai_research_reports FOR ALL USING (auth.role() = 'service_role');
`;

export async function GET() {
  try {
    // 使用 rpc 执行原始 SQL
    const { error } = await sb.rpc('exec_sql', { sql: CREATE_TABLE_SQL });
    
    if (error) {
      // 如果 rpc 不存在，返回需要手动执行的提示
      return NextResponse.json({
        success: false,
        message: '请手动在 Supabase SQL Editor 执行以下SQL',
        sql: CREATE_TABLE_SQL,
        instructions: [
          '1. 打开 Supabase Dashboard',
          '2. 进入 SQL Editor',
          '3. 粘贴上面的 SQL 并执行',
        ],
      });
    }
    
    return NextResponse.json({
      success: true,
      message: '✅ ai_research_reports 表创建成功',
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: '请手动在 Supabase SQL Editor 执行SQL',
      sql: CREATE_TABLE_SQL,
    });
  }
}