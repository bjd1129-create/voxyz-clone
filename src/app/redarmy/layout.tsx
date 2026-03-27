import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '红军商业服务 - 专业商业解决方案',
  description: '红军商业服务提供专业的商业咨询、项目开发、战略规划等全方位解决方案，助力企业成长与发展。',
}

export default function RedArmyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}