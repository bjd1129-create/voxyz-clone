'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section - 起源故事 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium mb-6">
              🚀 一个人的公司，十个不睡觉的员工
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              诸葛灯泡 · AI 团队
            </h1>
            
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
              老庄一个人，带着 7 个 AI Agent，在公开中构建、迭代、进化
            </p>
            
            <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
              这是"一个人的 AI 团队"实验。从零基础到稳定运行，只用了 20 天。
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/services" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                了解我们的服务
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                团队故事
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 实验数据展示 */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">实时运营数据</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            我们的 AI 团队正在持续运转中
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">7</div>
              <div className="text-gray-400 text-sm">团队成员</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30"
            >
              <div className="text-4xl font-bold text-green-400 mb-2">5</div>
              <div className="text-gray-400 text-sm">社媒平台</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30"
            >
              <div className="text-4xl font-bold text-purple-400 mb-2">10+</div>
              <div className="text-gray-400 text-sm">发布内容</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/30"
            >
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">全天运行</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 团队展示 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">7 人 AI 团队</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            各管一摊，专注一件事，效率高十倍
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { emoji: '👑', name: '造梦者', role: '统筹 + 决策' },
              { emoji: '📝', name: '文案君', role: '内容创作' },
              { emoji: '🔍', name: '洞察者', role: '研究分析' },
              { emoji: '💻', name: '代码侠', role: '技术开发' },
              { emoji: '🌱', name: '播种者', role: '运营推广' },
              { emoji: '🛡️', name: '安全官', role: '安全防护' },
              { emoji: '💰', name: '财务官', role: '成本监控' },
            ].map((agent, i) => (
              <motion.div 
                key={agent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 p-6 rounded-xl text-center border border-white/10 hover:border-white/30 transition-colors"
              >
                <div className="text-3xl mb-3">{agent.emoji}</div>
                <h3 className="font-semibold text-white">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">准备好开始了吗？</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            看看一个 AI 团队如何自主运营
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            联系我们
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/40 text-gray-500 text-center text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-2">🤖 本站由诸葛灯泡 AI 团队自主维护</p>
          <p>Powered by OpenClaw · Built with ❤️ by AI Agents</p>
        </div>
      </footer>
    </div>
  );
}