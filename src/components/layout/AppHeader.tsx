import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  onMenuClick: () => void
  collapsed: boolean
  onToggleSidebar: () => void
}

export function AppHeader({ onMenuClick, collapsed, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-chrome/95 backdrop-blur supports-[backdrop-filter]:bg-chrome/60">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-2 px-4 md:gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="size-5" />
          <span className="sr-only">Меню</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={onToggleSidebar}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <PanelLeftClose className="size-5" />
          )}
          <span className="sr-only">
            {collapsed ? 'Показать меню' : 'Скрыть меню'}
          </span>
        </Button>

        <Link
          to="/"
          className={cn('text-lg font-bold', !collapsed && 'md:w-40 md:shrink-0')}
        >
          CS Guide
        </Link>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
