import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  onMenuClick: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-chrome/95 backdrop-blur supports-[backdrop-filter]:bg-chrome/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-4 px-4 md:gap-6 md:px-0">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>

        <Link to="/" className="text-lg font-bold md:w-52 md:shrink-0">
          CS Guide
        </Link>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
