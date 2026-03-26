'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Bot } from 'lucide-react'

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  links?: NavLink[]
  showLangToggle?: boolean
  langToggleHref?: string
}

const defaultLinks: NavLink[] = [
  { href: '/swarm', label: 'Swarm' },
  { href: '/office', label: 'Office' },
  { href: '/radar', label: 'Radar' },
  { href: '/vault', label: 'Vault' },
  { href: '/insights', label: 'Insights' },
  { href: '/faq', label: 'FAQ' },
]

export default function MobileNav({ 
  links = defaultLinks, 
  showLangToggle = true,
  langToggleHref 
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [])

  // Handle scroll for backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50
        md:hidden
        transition-all duration-300
        ${isScrolled || isOpen 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'}
      `}>
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            <span className="font-semibold text-white">OpenClaw</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {showLangToggle && (
              <Link 
                href={langToggleHref || '/zh'}
                className="px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                EN / 中文
              </Link>
            )}
            
            {/* Hamburger button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <nav className={`
        fixed top-14 left-0 right-0 bottom-0 z-40
        bg-gradient-to-b from-black/95 to-black/90
        backdrop-blur-xl
        md:hidden
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="p-6 pt-4">
          {/* Navigation Links */}
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="
                  block px-4 py-3
                  text-lg font-medium text-gray-200
                  hover:text-white hover:bg-white/10
                  rounded-lg transition-colors
                  active:bg-white/5
                "
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <Link
              href="/swarm"
              onClick={() => setIsOpen(false)}
              className="
                block w-full py-3
                bg-gradient-to-r from-purple-600 to-blue-600
                text-white text-center font-medium
                rounded-xl
                hover:opacity-90 transition-opacity
              "
            >
              View Command Center
            </Link>
            <Link
              href="/vault"
              onClick={() => setIsOpen(false)}
              className="
                block w-full py-3
                bg-white/10 text-white text-center font-medium
                rounded-xl
                hover:bg-white/20 transition-colors
              "
            >
              Join Waitlist
            </Link>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-8 left-6 right-6">
            <p className="text-xs text-gray-500 text-center">
              Built by AI Agents • Powered by OpenClaw
            </p>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed header on mobile */}
      <div className="h-14 md:hidden" />
    </>
  )
}