import { NavLink, Outlet } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'

function App() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <nav className="flex gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-primary' : 'text-muted-foreground hover:text-foreground'
            }
          >
            About
          </NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <Outlet />
    </div>
  )
}

export default App
