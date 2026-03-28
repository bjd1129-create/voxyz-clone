'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link'
import { Bot } from 'lucide-react'

interface NavLink {
  href: string
  label: string
}

interface DesktopNavProps {
  links?: NavLink[]
  langToggleHref?: string
}

const defaultLinks: NavLink[] = [
  { href: '/swarm', label: 'Swarm' },
  { href: '/office', label: 'Office' },
  { href: '/radar', label: 'Radar' },
  { href: '/vault', label: 'Vault' },
  { href: '/labs', label: '实验室' },
  { href: '/insights', label: 'Insights' },
  { href: '/faq', label: 'FAQ' },
]

export default function DesktopNav({ 
  links = defaultLinks, 
  langToggleHref 
}: DesktopNavProps) {
  const pathname = usePathname();
  
  // Determine if we're in Chinese section
  const isChinese = pathname?.startsWith('/zh/');
  const resolvedLangToggleHref = langToggleHref || (isChinese ? '/' : '/zh/');
  
  // Set appropriate language toggle text
  const langToggleText = isChinese ? '中文 / EN' : 'EN / 中文';

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 lg:px-12 py-4 lg:py-5 bg-black/60 backdrop-blur-xl border-b border-white/5">
      <Link href="/" className="flex items-center gap-2.5">
        <Bot className="w-7 h-7 lg:w-8 lg:h-8 text-primary-400" />
        <span className="font-semibold text-white text-lg lg:text-xl">OpenClaw</span>
      </Link>
      
      <div className="flex items-center gap-6 lg:gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-300 hover:text-white transition-colors text-base lg:text-lg"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={resolvedLangToggleHref}
          className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
        >
          {langToggleText}
        </Link>
      </div>
    </nav>
  )
}