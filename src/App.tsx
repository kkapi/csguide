import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/utils/useLocalStorage'

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)
  // Сворачивается ради узких окон: в оверлее Steam 1280×1024 боковое меню
  // съедает заметную часть ширины, а картинки гранат хочется пошире.
  const [collapsed, setCollapsed] = useLocalStorage('csguide.sidebar.collapsed', false)

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader
        onMenuClick={() => setMobileOpen(true)}
        collapsed={collapsed}
        onToggleSidebar={() => setCollapsed((v) => !v)}
      />

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="mx-auto flex w-full max-w-[1600px] min-h-0 flex-1 gap-6 px-4">
        <aside
          className={cn('w-52 shrink-0 self-start', collapsed ? 'hidden' : 'hidden md:block')}
        >
          <div className="scrollbar-hidden sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <SidebarNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-6 pb-16 md:pb-6">
          <Outlet />
        </main>
      </div>

      <AppFooter />
      <Toaster />
    </div>
  )
}

export default App
