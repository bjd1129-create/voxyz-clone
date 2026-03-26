'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface GlowingButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  icon?: ReactNode
}

export default function GlowingButton({
  href,
  children,
  variant = 'primary',
  icon,
}: GlowingButtonProps) {
  const baseStyles = `
    relative overflow-hidden
    inline-flex items-center gap-2 
    px-6 py-3 
    rounded-lg font-medium 
    transition-all duration-300
    group
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-purple-600 to-blue-600
      hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50
      active:scale-95
    `,
    secondary: `
      bg-white/10 backdrop-blur-sm
      border border-white/20
      hover:bg-white/20 hover:shadow-lg hover:shadow-white/10
      hover:border-white/30
      active:scale-95
    `,
  }

  return (
    <Link href={href} className={`${baseStyles} ${variants[variant]}`}>
      {/* Gradient overlay for shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>

      {/* Glow effect on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-xl -z-10" />
    </Link>
  )
}