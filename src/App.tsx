import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'
import { MobileSidebar } from '@/components/layout/MobileSidebar'
import { RightAside } from '@/components/layout/RightAside'
import { SidebarNav } from '@/components/layout/SidebarNav'

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader onMenuClick={() => setMobileOpen(true)} />

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="mx-auto flex w-full max-w-screen-xl flex-1 min-h-0 gap-6 px-4 md:px-0">
        <aside className="hidden w-52 shrink-0 self-start md:block">
          <div className="scrollbar-hidden sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            <SidebarNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-6 pb-16 md:pb-6">
          <Outlet />
        </main>

        <aside className="hidden w-44 shrink-0 xl:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-auto py-6">
            <RightAside />
          </div>
        </aside>
      </div>

      <AppFooter />
    </div>
  )
}

export default App
