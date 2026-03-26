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

// Vercel Cron Authorization
function verifyCronAuth(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If CRON_SECRET is set, verify it
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }
  
  // In development, allow without secret
  return process.env.NODE_ENV === 'development';
}

// 研究主题轮换 - 每天8篇，每3小时1篇
const RESEARCH_THEMES = [
  // 00:00 - 技术前沿
  {
    time: '00:00',
    theme: '技术前沿',
    focus: '最新AI技术突破、模型架构创新、训练方法优化',
    keywords: ['LLM', 'Transformer', 'RAG', 'Fine-tuning', 'Multi-modal'],
    regions: ['全球'],
  },
  // 03:00 - 商业应用
  {
    time: '03:00',
    theme: '商业应用',
    focus: 'AI在企业的落地案例、商业模式、ROI分析',
    keywords: ['Enterprise AI', 'SaaS', 'Automation', 'Cost reduction'],
    regions: ['北美', '欧洲'],
  },
  // 06:00 - 亚太市场
  {
    time: '06:00',
    theme: '亚太市场',
    focus: '亚太地区AI发展、政策法规、市场动态',
    keywords: ['AI policy', 'China AI', 'Japan AI', 'Southeast Asia'],
    regions: ['中国', '日本', '韩国', '东南亚'],
  },
  // 09:00 - 产品创新
  {
    time: '09:00',
    theme: '产品创新',
    focus: 'AI产品发布、功能更新、用户体验创新',
    keywords: ['Product launch', 'Feature update', 'UX innovation'],
    regions: ['全球'],
  },
  // 12:00 - 投融资动态
  {
    time: '12:00',
    theme: '投融资动态',
    focus: 'AI领域融资、并购、IPO、估值变化',
    keywords: ['Funding', 'Acquisition', 'IPO', 'Valuation'],
    regions: ['全球'],
  },
  // 15:00 - 开源生态
  {
    time: '15:00',
    theme: '开源生态',
    focus: '开源模型、工具框架、社区动态',
    keywords: ['Open source', 'Hugging Face', 'GitHub trending', 'Community'],
    regions: ['全球'],
  },
  // 18:00 - 研究论文
  {
    time: '18:00',
    theme: '研究论文',
    focus: '顶级会议论文、学术突破、研究趋势',
    keywords: ['arXiv', 'NeurIPS', 'ICML', 'ACL', 'Research paper'],
    regions: ['全球'],
  },
  // 21:00 - 未来趋势
  {
    time: '21:00',
    theme: '未来趋势',
    focus: 'AI发展方向预测、伦理讨论、社会影响',
    keywords: ['AGI', 'AI Safety', 'Ethics', 'Future of AI'],
    regions: ['全球'],
  },
];

// 获取当前应该执行的研究主题
function getCurrentTheme() {
  const now = new Date();
  const hour = now.getUTCHours();
  
  // 找到最接近的主题
  const themes = RESEARCH_THEMES.map(t => ({
    ...t,
    hourNum: parseInt(t.time.split(':')[0]),
  }));
  
  // 按UTC小时匹配
  const currentTheme = themes.find(t => t.hourNum === hour) || themes[0];
  return currentTheme;
}

// 生成研究报告
async function generateReport(theme: typeof RESEARCH_THEMES[0]) {
  const now = new Date();
  const reportId = `AI-RESEARCH-${now.toISOString().split('T')[0]}-${theme.time.replace(':', '')}`;
  
  const report = {
    id: reportId,
    title: `【${theme.theme}】AI研究报告 - ${now.toLocaleDateString('zh-CN')}`,
    generatedAt: now.toISOString(),
    theme: theme.theme,
    focus: theme.focus,
    keywords: theme.keywords,
    regions: theme.regions,
    sections: [
      {
        title: '🔍 核心发现',
        content: `本时段聚焦${theme.theme}领域，关键词：${theme.keywords.join('、')}，重点关注区域：${theme.regions.join('、')}`,
      },
      {
        title: '📊 数据洞察',
        content: '基于多源数据聚合分析，提取关键趋势和模式',
      },
      {
        title: '🎯 行动建议',
        content: '针对发现的机会和风险，提出可执行的建议',
      },
      {
        title: '📚 参考资料',
        content: '来源链接和进一步阅读材料',
      },
    ],
    status: 'draft',
    needsReview: true,
  };
  
  return report;
}

// 同步给团队成员
async function syncToTeam(report: any) {
  let dbSuccess = false;
  let notifySuccess = false;
  
  // 尝试存储到数据库（可选）
  try {
    const { error } = await sb.from('ai_research_reports').insert({
      id: report.id,
      title: report.title,
      theme: report.theme,
      focus: report.focus,
      keywords: report.keywords,
      regions: report.regions,
      content: report.sections,
      status: report.status,
      created_at: report.generatedAt,
    });
    
    if (!error) {
      dbSuccess = true;
    }
  } catch (e) {
    console.log('Database not available, skipping DB storage');
  }
  
  // 尝试通知团队（通过事件系统）
  try {
    const { error } = await sb.from('events').insert({
      type: 'ai_research_report',
      agent_id: 'researcher',
      data: {
        report_id: report.id,
        title: report.title,
        theme: report.theme,
      },
      created_at: report.generatedAt,
    });
    
    if (!error) {
      notifySuccess = true;
    }
  } catch (e) {
    console.log('Events table not available, skipping notification');
  }
  
  // 即使数据库不可用，报告也算生成成功
  return { 
    success: true, 
    reportId: report.id,
    dbStored: dbSuccess,
    notified: notifySuccess,
  };
}

export async function GET(request: Request) {
  // Verify cron authorization
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const forceTheme = searchParams.get('theme');
    const action = searchParams.get('action') || 'generate';
    
    // 获取当前主题或强制指定
    const theme = forceTheme 
      ? RESEARCH_THEMES.find(t => t.theme === forceTheme) || RESEARCH_THEMES[0]
      : getCurrentTheme();
    
    if (action === 'list') {
      // 列出所有主题配置
      return NextResponse.json({
        themes: RESEARCH_THEMES,
        currentTheme: theme,
        schedule: '每3小时自动执行一次，每天8篇',
      });
    }
    
    if (action === 'history') {
      // 获取历史报告
      const limit = parseInt(searchParams.get('limit') || '10');
      const { data, error } = await sb
        .from('ai_research_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json({
        reports: data,
        total: data.length,
      });
    }
    
    // 生成报告
    const report = await generateReport(theme);
    const syncResult = await syncToTeam(report);
    
    return NextResponse.json({
      success: syncResult.success,
      report: {
        id: report.id,
        title: report.title,
        theme: report.theme,
        focus: report.focus,
        generatedAt: report.generatedAt,
        sections: report.sections,
      },
      sync: {
        dbStored: syncResult.dbStored,
        notified: syncResult.notified,
      },
      message: `✅ AI研究报告已生成${syncResult.dbStored ? '并存储' : ''}`,
      nextReport: RESEARCH_THEMES[(RESEARCH_THEMES.indexOf(theme) + 1) % RESEARCH_THEMES.length].time,
    });
    
  } catch (error) {
    console.error('AI Research API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// POST 用于手动触发
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { theme: forceTheme, customKeywords, customRegions } = body;
    
    const theme = forceTheme 
      ? RESEARCH_THEMES.find(t => t.theme === forceTheme) || RESEARCH_THEMES[0]
      : getCurrentTheme();
    
    // 如果有自定义参数，覆盖默认值
    const customTheme = {
      ...theme,
      keywords: customKeywords || theme.keywords,
      regions: customRegions || theme.regions,
    };
    
    const report = await generateReport(customTheme);
    const syncResult = await syncToTeam(report);
    
    return NextResponse.json({
      success: syncResult.success,
      report,
      message: syncResult.success 
        ? `✅ 自定义AI研究报告已生成`
        : `⚠️ 报告生成成功，但同步失败`,
    });
    
  } catch (error) {
    console.error('AI Research POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}