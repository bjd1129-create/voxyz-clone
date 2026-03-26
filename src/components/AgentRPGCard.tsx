'use client'

import { ReactNode } from 'react'

interface AgentRPGStats {
  vrl: number  // Viral Score: 互动影响力 (0-100)
  tru: number  // Trust Score: 任务成功率 (0-100)
  wis: number  // Wisdom Score: 知识积累 (0-100)
  level: number
  experience: number
  tasksCompleted: number
}

interface AgentRPGCardProps {
  name: string
  codeName: string  // 代号
  role: string
  icon: ReactNode
  color: AgentColor
  stats: AgentRPGStats
}

type AgentColor = 'coordinator' | 'researcher' | 'writer' | 'engineer' | 'designer' | 'support'

const agentColors = {
  coordinator: {
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30',
    icon: 'text-purple-400',
    accent: 'purple',
    hex: '#A855F7',
  },
  researcher: {
    bg: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/30',
    icon: 'text-orange-400',
    accent: 'orange',
    hex: '#F59E0B',
  },
  writer: {
    bg: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/30',
    icon: 'text-green-400',
    accent: 'green',
    hex: '#10B981',
  },
  engineer: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/30',
    icon: 'text-blue-400',
    accent: 'blue',
    hex: '#3B82F6',
  },
  designer: {
    bg: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/30',
    icon: 'text-pink-400',
    accent: 'pink',
    hex: '#EC4899',
  },
  support: {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/30',
    icon: 'text-cyan-400',
    accent: 'cyan',
    hex: '#06B6D4',
  },
}

const statConfig = {
  vrl: {
    name: 'VRL',
    fullName: 'Viral Score',
    description: '互动影响力',
    gradient: 'from-red-500 to-orange-500',
    icon: '🔥',
  },
  tru: {
    name: 'TRU',
    fullName: 'Trust Score',
    description: '任务成功率',
    gradient: 'from-green-500 to-emerald-500',
    icon: '🛡️',
  },
  wis: {
    name: 'WIS',
    fullName: 'Wisdom Score',
    description: '知识积累',
    gradient: 'from-blue-500 to-purple-500',
    icon: '💡',
  },
}

function StatBar({ 
  stat, 
  value, 
  delay = 0 
}: { 
  stat: keyof typeof statConfig
  value: number
  delay?: number
}) {
  const config = statConfig[stat]
  
  return (
    <div className="group/stat relative">
      {/* Stat header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{config.icon}</span>
          <span className="text-xs font-bold text-white/90">{config.name}</span>
          <span className="text-[10px] text-gray-500 hidden sm:inline">({config.fullName})</span>
        </div>
        <span className="text-xs font-mono text-white/80 tabular-nums">{value}</span>
      </div>
      
      {/* Progress bar container */}
      <div className="relative h-2 sm:h-2.5 rounded-full bg-white/5 overflow-hidden backdrop-blur-sm border border-white/10">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0" />
        
        {/* Progress fill */}
        <div
          className={`
            absolute inset-y-0 left-0 rounded-full
            bg-gradient-to-r ${config.gradient}
            transition-all duration-1000 ease-out
            shadow-lg
          `}
          style={{ 
            width: `${value}%`,
            animationDelay: `${delay}ms`,
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full" />
          
          {/* Shine animation */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div 
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animationDelay: `${delay}ms`,
              }}
            />
          </div>
        </div>
        
        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-30">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-px h-full bg-white/20" />
          ))}
        </div>
      </div>
      
      {/* Tooltip on hover */}
      <div className="
        absolute left-1/2 -translate-x-1/2 -top-8
        px-2 py-1 rounded bg-black/80 backdrop-blur-sm
        text-[10px] text-gray-300 whitespace-nowrap
        opacity-0 group-hover/stat:opacity-100 transition-opacity
        pointer-events-none z-20
      ">
        {config.description}
      </div>
    </div>
  )
}

function LevelBadge({ level }: { level: number }) {
  const getLevelColor = (lvl: number) => {
    if (lvl >= 50) return 'from-yellow-400 to-orange-500'
    if (lvl >= 30) return 'from-purple-400 to-pink-500'
    if (lvl >= 15) return 'from-blue-400 to-cyan-500'
    return 'from-gray-400 to-gray-500'
  }
  
  return (
    <div className="relative group/level">
      {/* Glow background */}
      <div className={`
        absolute inset-0 blur-md opacity-50
        bg-gradient-to-br ${getLevelColor(level)}
        group-hover/level:opacity-75 transition-opacity
      `} />
      
      {/* Badge */}
      <div className={`
        relative px-2 py-0.5 rounded-full
        bg-gradient-to-br ${getLevelColor(level)}
        text-white text-[10px] font-bold
        shadow-lg border border-white/20
      `}>
        LV.{level}
      </div>
    </div>
  )
}

export default function AgentRPGCard({ 
  name, 
  codeName, 
  role, 
  icon, 
  color, 
  stats 
}: AgentRPGCardProps) {
  const colorStyles = agentColors[color]
  
  return (
    <div className={`
      relative group
      p-4 sm:p-5 rounded-2xl
      bg-gradient-to-br ${colorStyles.bg}
      border ${colorStyles.border}
      backdrop-blur-sm
      transition-all duration-300
      hover:scale-[1.02] hover:-translate-y-1
      hover:shadow-2xl ${colorStyles.glow}
      overflow-hidden
    `}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${colorStyles.hex} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Icon container */}
          <div className={`
            relative w-12 h-12 sm:w-14 sm:h-14
            rounded-xl
            bg-gradient-to-br ${colorStyles.bg}
            border ${colorStyles.border}
            flex items-center justify-center
            group-hover:scale-105 transition-transform duration-300
          `}>
            {/* Animated glow ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm animate-pulse" />
            
            {/* Icon */}
            <div className={`relative z-10 ${colorStyles.icon}`}>
              {icon}
            </div>
          </div>
          
          {/* Name and code */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">{name}</h3>
              <LevelBadge level={stats.level} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase tracking-wider">
                {codeName}
              </span>
              <span className="text-gray-600">·</span>
              <span className="text-[10px] sm:text-xs text-gray-500">{role}</span>
            </div>
          </div>
        </div>
        
        {/* Tasks completed badge */}
        <div className="text-right">
          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tabular-nums">
            {stats.tasksCompleted}
          </div>
          <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wider">
            Tasks
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="relative space-y-3 mb-4">
        <StatBar stat="vrl" value={stats.vrl} delay={0} />
        <StatBar stat="tru" value={stats.tru} delay={100} />
        <StatBar stat="wis" value={stats.wis} delay={200} />
      </div>
      
      {/* XP bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Experience</span>
          <span className="text-[10px] font-mono text-gray-400 tabular-nums">
            {stats.experience.toLocaleString()} XP
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
          <div 
            className={`
              h-full rounded-full
              bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500
              animate-pulse-slow
            `}
            style={{ 
              width: `${Math.min((stats.experience % 1000) / 10, 100)}%`,
            }}
          />
        </div>
      </div>
      
      {/* Hover border glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
        style={{ background: `radial-gradient(circle at 50% 50%, ${colorStyles.hex}30, transparent 70%)` }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

// Export types and configs for external use
export type { AgentRPGStats, AgentColor }
export { agentColors, statConfig }