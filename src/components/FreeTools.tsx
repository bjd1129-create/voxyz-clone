'use client';

import Link from 'next/link';
import { Wrench, Code, FileText, Search, Target, Palette, Globe, MessageSquare, Zap, Bot } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  description: string;
  icon: JSX.Element;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  href: string;
}

const TOOLS: Tool[] = [
  {
    id: 1,
    name: 'Demand Radar',
    description: '实时监测市场需求信号，发现新兴机会',
    icon: <Target className="w-6 h-6 text-purple-400" />,
    category: 'Analytics',
    difficulty: 'Beginner',
    href: '/radar'
  },
  {
    id: 2,
    name: 'AI Swarm Commander',
    description: '管理多智能体团队，协同完成复杂任务',
    icon: <Bot className="w-6 h-6 text-blue-400" />,
    category: 'Productivity',
    difficulty: 'Intermediate',
    href: '/swarm'
  },
  {
    id: 3,
    name: 'Content Generator',
    description: 'AI驱动的内容创作工具，提升写作效率',
    icon: <FileText className="w-6 h-6 text-green-400" />,
    category: 'Content',
    difficulty: 'Beginner',
    href: '/insights'
  },
  {
    id: 4,
    name: 'Task Analyzer',
    description: '深度分析任务复杂度，智能分配资源',
    icon: <Search className="w-6 h-6 text-yellow-400" />,
    category: 'Analysis',
    difficulty: 'Intermediate',
    href: '/insights'
  },
  {
    id: 5,
    name: 'Workflow Builder',
    description: '可视化工作流设计，自动化业务流程',
    icon: <Zap className="w-6 h-6 text-orange-400" />,
    category: 'Automation',
    difficulty: 'Advanced',
    href: '/office'
  },
  {
    id: 6,
    name: 'Pixel Office',
    description: '虚拟办公室，远程团队协作平台',
    icon: <Globe className="w-6 h-6 text-indigo-400" />,
    category: 'Collaboration',
    difficulty: 'Beginner',
    href: '/office'
  }
];

const FreeTools = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-10 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            免费工具集
          </h2>
          <p className="text-gray-400 text-base lg:text-lg max-w-2xl mx-auto">
            发现我们的免费AI工具，帮助您提升工作效率，探索新机遇
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TOOLS.map((tool) => (
            <Link 
              key={tool.id}
              href={tool.href}
              className="group p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold truncate">{tool.name}</h3>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full whitespace-nowrap">
                      {tool.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 text-base mb-3 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full">
                      {tool.category}
                    </span>
                    <span className="text-sm text-purple-400 group-hover:text-purple-300 transition-colors">
                      使用工具 →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeTools;