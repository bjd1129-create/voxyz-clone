'use client';

import { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ============================================
// Types
// ============================================

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
}

interface ChartData {
  date: string;
  value: number;
  [key: string]: string | number;
}

// ============================================
// Mock Data (Replace with actual API calls)
// ============================================

const mockDAUData = [
  { date: '03-21', dau: 1250, mau: 8500 },
  { date: '03-22', dau: 1320, mau: 8600 },
  { date: '03-23', dau: 1180, mau: 8650 },
  { date: '03-24', dau: 1450, mau: 8700 },
  { date: '03-25', dau: 1580, mau: 8750 },
  { date: '03-26', dau: 1620, mau: 8800 },
  { date: '03-27', dau: 1700, mau: 8850 },
];

const mockRevenueData = [
  { month: 'Jan', mrr: 45000, arr: 540000 },
  { month: 'Feb', mrr: 52000, arr: 624000 },
  { month: 'Mar', mrr: 61000, arr: 732000 },
];

const mockRetentionData = [
  { name: 'Day 1', value: 75 },
  { name: 'Day 7', value: 45 },
  { name: 'Day 30', value: 25 },
];

const mockFunnelData = [
  { stage: '访问', count: 10000, rate: 100 },
  { stage: '注册', count: 2500, rate: 25 },
  { stage: '激活', count: 1500, rate: 15 },
  { stage: '付费', count: 300, rate: 3 },
];

const mockChannelData = [
  { channel: '自然搜索', users: 4500, conversion: 12 },
  { channel: '付费广告', users: 2800, conversion: 8 },
  { channel: '社交媒体', users: 1500, conversion: 6 },
  { channel: '推荐', users: 800, conversion: 15 },
];

const mockTaskMetrics = [
  { type: '代码生成', total: 15200, success: 98.5, avgTime: 2.3 },
  { type: '文档处理', total: 8500, success: 99.2, avgTime: 1.8 },
  { type: '数据分析', total: 4200, success: 97.8, avgTime: 5.2 },
  { type: '对话问答', total: 28500, success: 99.8, avgTime: 0.5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// ============================================
// Components
// ============================================

function MetricCard({ title, value, change, changeLabel, icon, color }: MetricCard) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
              }`}>
                {isPositive ? '↑' : isNegative ? '↓' : ''} {Math.abs(change)}%
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-400 ml-2">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl`} 
             style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, trend }: { 
  label: string; 
  value: string | number; 
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
      {subValue && (
        <p className={`text-sm mt-1 ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 'text-gray-500'
        }`}>{subValue}</p>
      )}
    </div>
  );
}

function ProgressBar({ value, max, color = 'blue' }: { 
  value: number; 
  max: number; 
  color?: string;
}) {
  const percentage = (value / max) * 100;
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${colorClasses[color] || colorClasses.blue}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// ============================================
// Page Component
// ============================================

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'business' | 'product' | 'marketing'>('overview');
  
  // User metrics
  const userMetrics: MetricCard[] = [
    { title: '注册用户', value: '12,580', change: 8.5, changeLabel: 'vs 上周', icon: '👥', color: '#0088FE' },
    { title: 'DAU', value: '1,700', change: 5.2, changeLabel: 'vs 昨日', icon: '📱', color: '#00C49F' },
    { title: 'MAU', value: '8,850', change: 3.1, changeLabel: 'vs 上月', icon: '📊', color: '#FFBB28' },
    { title: '留存率(次日)', value: '75%', change: 2.3, changeLabel: 'vs 上周', icon: '🔄', color: '#FF8042' },
  ];

  // Business metrics
  const businessMetrics: MetricCard[] = [
    { title: 'MRR', value: '¥61,000', change: 17.3, changeLabel: 'vs 上月', icon: '💰', color: '#0088FE' },
    { title: 'ARR', value: '¥732,000', change: 35.6, changeLabel: 'vs 上年', icon: '📈', color: '#00C49F' },
    { title: 'ARPU', value: '¥48.5', change: 4.2, changeLabel: 'vs 上月', icon: '💵', color: '#FFBB28' },
    { title: 'Churn Rate', value: '3.2%', change: -0.5, changeLabel: 'vs 上月', icon: '📉', color: '#FF8042' },
  ];

  // Product metrics
  const productMetrics: MetricCard[] = [
    { title: '任务完成数', value: '66,400', change: 22.5, changeLabel: 'vs 上周', icon: '✅', color: '#0088FE' },
    { title: '平均响应时间', value: '1.8s', change: -12.5, changeLabel: 'vs 上周', icon: '⚡', color: '#00C49F' },
    { title: '成功率', value: '98.7%', change: 0.3, changeLabel: 'vs 上周', icon: '🎯', color: '#FFBB28' },
    { title: '用户满意度', value: '4.6/5', change: 0.1, changeLabel: 'vs 上月', icon: '⭐', color: '#FF8042' },
  ];

  // Marketing metrics
  const marketingMetrics: MetricCard[] = [
    { title: 'CAC', value: '¥85', change: -5.2, changeLabel: 'vs 上月', icon: '📢', color: '#0088FE' },
    { title: 'LTV/CAC', value: '3.2x', change: 15.8, changeLabel: 'vs 上月', icon: '💎', color: '#00C49F' },
    { title: '转化率', value: '3.0%', change: 0.5, changeLabel: 'vs 上周', icon: '🎯', color: '#FFBB28' },
    { title: '付费用户', value: '300', change: 20, changeLabel: 'vs 上月', icon: '👑', color: '#FF8042' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">数据分析仪表盘</h1>
            <p className="text-gray-500 text-sm mt-1">实时监控核心业务指标</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${
                    timeRange === range 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
                </button>
              ))}
            </div>
            
            {/* Refresh Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <span>🔄</span>
              <span className="text-sm">刷新</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b border-gray-100">
          {([
            { key: 'overview', label: '概览', icon: '📊' },
            { key: 'users', label: '用户', icon: '👥' },
            { key: 'business', label: '业务', icon: '💰' },
            { key: 'product', label: '产品', icon: '🚀' },
            { key: 'marketing', label: '营销', icon: '📢' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard {...userMetrics[0]} />
              <MetricCard {...businessMetrics[0]} />
              <MetricCard {...productMetrics[0]} />
              <MetricCard {...marketingMetrics[0]} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DAU/MAU Trend */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">DAU/MAU 趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockDAUData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="dau" name="DAU" stroke="#0088FE" fill="#0088FE" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="mau" name="MAU" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Trend */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">收入趋势</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mrr" name="MRR (¥)" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <StatCard label="新增用户(今日)" value="142" subValue="↑ 12% vs 昨日" trend="up" />
              <StatCard label="任务数(今日)" value="2,850" subValue="↑ 8% vs 昨日" trend="up" />
              <StatCard label="活跃订阅" value="1,250" />
              <StatCard label="本周收入" value="¥15,200" subValue="↑ 23% vs 上周" trend="up" />
              <StatCard label="平均会话时长" value="18.5分钟" />
              <StatCard label="NPS评分" value="42" subValue="良好" trend="up" />
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userMetrics.map((metric, i) => (
                <MetricCard key={i} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Retention Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">留存率分布</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockRetentionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {mockRetentionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth Table */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">用户分层</h3>
                <div className="space-y-4">
                  {[
                    { tier: '超级用户', count: 520, percent: 4.1, color: 'purple' },
                    { tier: '活跃用户', count: 2850, percent: 22.7, color: 'blue' },
                    { tier: '普通用户', count: 6500, percent: 51.7, color: 'green' },
                    { tier: '沉默用户', count: 2710, percent: 21.5, color: 'gray' },
                  ].map((row) => (
                    <div key={row.tier}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{row.tier}</span>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">{row.count.toLocaleString()}</span>
                          <span className="ml-2">({row.percent}%)</span>
                        </div>
                      </div>
                      <ProgressBar value={row.percent} max={100} color={row.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {businessMetrics.map((metric, i) => (
                <MetricCard key={i} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MRR Movement */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">MRR 变化</h3>
                <div className="space-y-4">
                  {[
                    { label: '新增 MRR', value: 8500, type: 'positive' },
                    { label: '扩展 MRR', value: 3200, type: 'positive' },
                    { label: '收缩 MRR', value: -1500, type: 'negative' },
                    { label: '流失 MRR', value: -1200, type: 'negative' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className={`text-lg font-semibold ${
                        item.type === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.value > 0 ? '+' : ''}¥{item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription Distribution */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">订阅分布</h3>
                <div className="space-y-4">
                  {[
                    { plan: 'Free', users: 12280, mrr: 0, color: 'gray' },
                    { plan: 'Pro', users: 280, mrr: 27720, color: 'blue' },
                    { plan: 'Enterprise', users: 20, mrr: 19980, color: 'purple' },
                  ].map((item) => (
                    <div key={item.plan} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.plan}</p>
                        <p className="text-sm text-gray-500">{item.users.toLocaleString()} 用户</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">¥{item.mrr.toLocaleString()}/月</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Product Tab */}
        {activeTab === 'product' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {productMetrics.map((metric, i) => (
                <MetricCard key={i} {...metric} />
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent 任务分析</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">任务类型</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">总任务数</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">成功率</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">平均耗时</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTaskMetrics.map((task) => (
                      <tr key={task.type} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{task.type}</td>
                        <td className="py-3 px-4 text-right text-gray-600">{task.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            task.success >= 99 ? 'bg-green-100 text-green-700' :
                            task.success >= 95 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {task.success}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">{task.avgTime}s</td>
                        <td className="py-3 px-4">
                          <ProgressBar value={task.success} max={100} color="green" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <StatCard label="API调用(今日)" value="58,420" subValue="↑ 15% vs 昨日" trend="up" />
              <StatCard label="错误率" value="0.3%" subValue="↓ 0.1% vs 昨日" trend="up" />
              <StatCard label="P99响应时间" value="2.1s" subValue="目标 < 3s" />
            </div>
          </>
        )}

        {/* Marketing Tab */}
        {activeTab === 'marketing' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketingMetrics.map((metric, i) => (
                <MetricCard key={i} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">转化漏斗</h3>
                <div className="space-y-4">
                  {mockFunnelData.map((stage, index) => (
                    <div key={stage.stage}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {index + 1}. {stage.stage}
                        </span>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{stage.count.toLocaleString()}</span>
                          <span className="text-gray-500 ml-2">({stage.rate}%)</span>
                        </div>
                      </div>
                      <ProgressBar 
                        value={stage.rate} 
                        max={100} 
                        color={index === 0 ? 'blue' : index === mockFunnelData.length - 1 ? 'green' : 'blue'} 
                      />
                      {index < mockFunnelData.length - 1 && (
                        <div className="flex justify-end text-xs text-red-500 mt-1">
                          ↓ 流失: {(mockFunnelData[index].rate - mockFunnelData[index + 1].rate).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">渠道效果</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockChannelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#888" fontSize={12} />
                    <YAxis dataKey="channel" type="category" stroke="#888" fontSize={12} width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" name="用户数" fill="#0088FE" />
                    <Bar dataKey="conversion" name="转化率%" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CAC Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CAC 分析 (按渠道)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { channel: '自然搜索', cac: 45, ltv: 180, ratio: 4.0 },
                  { channel: '付费广告', cac: 120, ltv: 240, ratio: 2.0 },
                  { channel: '社交媒体', cac: 85, ltv: 150, ratio: 1.8 },
                  { channel: '推荐', cac: 25, ltv: 200, ratio: 8.0 },
                ].map((item) => (
                  <div key={item.channel} className="p-4 border border-gray-100 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">{item.channel}</p>
                    <p className="text-lg font-semibold text-gray-900">¥{item.cac}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-500">LTV: ¥{item.ltv}</span>
                      <span className={`font-medium ${
                        item.ratio >= 3 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {item.ratio}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>数据更新时间: {new Date().toLocaleString('zh-CN')} · 数据分析仪表盘 v1.0</p>
      </div>
    </div>
  );
}