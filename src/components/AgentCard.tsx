'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface AgentCardProps {
  name: string
  role: string
  color: string
  icon: ReactNode
  href: string
}

const agentColors = {
  ceo: {
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/30',
    icon: 'text-purple-400',
  },
  creative: {
    bg: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/30',
    icon: 'text-pink-400',
  },
  developer: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/30',
    icon: 'text-blue-400',
  },
  writer: {
    bg: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/30',
    icon: 'text-green-400',
  },
  researcher: {
    bg: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/30',
    icon: 'text-orange-400',
  },
  support: {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/30',
    icon: 'text-cyan-400',
  },
}

export default function AgentCard({ name, role, color, icon, href }: AgentCardProps) {
  const colorStyles = agentColors[color as keyof typeof agentColors] || agentColors.ceo

  return (
    <Link
      href={href}
      className={`
        group relative
        p-4 rounded-xl
        bg-gradient-to-br ${colorStyles.bg}
        border ${colorStyles.border}
        backdrop-blur-sm
        transition-all duration-300
        hover:scale-105 hover:-translate-y-1
        hover:shadow-xl ${colorStyles.glow}
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Icon container with glow */}
      <div className="relative">
        <div className={`
          w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3
          rounded-full
          bg-gradient-to-br ${colorStyles.bg}
          flex items-center justify-center
          text-2xl sm:text-3xl
          group-hover:scale-110 transition-transform duration-300
          relative
        `}>
          {/* Animated glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm animate-pulse" />
          
          {/* Icon */}
          <div className={`relative z-10 ${colorStyles.icon}`}>
            {icon}
          </div>
        </div>

        {/* Text */}
        <div className="text-center relative z-10">
          <div className="font-medium text-white group-hover:text-white/90 transition-colors">
            {name}
          </div>
          <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {role}
          </div>
        </div>
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
    </Link>
  )
}