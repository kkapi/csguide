import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import {
  type NavLeafItem,
  type NavSection,
  navSections,
  type NavSubSection,
} from '@/config/nav'
import { maps } from '@/data/maps'
import { useLearnedNades } from '@/features/nades/useLearnedNades'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  onNavigate?: () => void
}

function LeafLink({ item, onNavigate }: { item: NavLeafItem; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'block py-1.5 text-sm transition-colors',
          isActive
            ? 'font-medium text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )
      }
    >
      {item.title}
    </NavLink>
  )
}

/** «12/43» рядом с картой — видно прогресс, не заходя на страницу. */
function MapProgress({ sub }: { sub: NavSubSection }) {
  const { countLearned } = useLearnedNades()
  const map = sub.mapSlug ? maps[sub.mapSlug] : undefined
  if (!map || map.nades.length === 0) return null

  const learned = countLearned(map.nades)
  return (
    <span
      className={cn(
        'ml-auto mr-1.5 shrink-0 text-[11px] tabular-nums',
        learned === map.nades.length ? 'text-primary' : 'text-muted-foreground/60',
      )}
      title={`Выучено ${learned} из ${map.nades.length}`}
    >
      {learned}/{map.nades.length}
    </span>
  )
}

function SubSection({ sub, onNavigate }: { sub: NavSubSection; onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const hasActiveChild = sub.items.some((item) => item.href === pathname)
  const [open, setOpen] = useState(sub.defaultOpen ?? hasActiveChild)

  // Переход по прямой ссылке раскрывает нужную карту, иначе активный пункт
  // окажется внутри свёрнутого блока и его не видно. Правим состояние прямо
  // в рендере — эффект тут дал бы лишний проход и мигание.
  const [wasActive, setWasActive] = useState(hasActiveChild)
  if (hasActiveChild !== wasActive) {
    setWasActive(hasActiveChild)
    if (hasActiveChild) setOpen(true)
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-1 py-1.5 text-sm transition-colors hover:text-primary',
          !open && hasActiveChild ? 'font-medium text-primary' : 'text-foreground',
        )}
      >
        {sub.title}
        <MapProgress sub={sub} />
        <ChevronRight
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </button>

      <div
        className={cn(
          'grid [transition:grid-template-rows_200ms_ease-in-out]',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <ul className="ml-1 space-y-0.5 overflow-hidden border-l border-border pl-3">
          {sub.items.map((item) => (
            <li key={item.href}>
              <LeafLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Section({ section, onNavigate }: { section: NavSection; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="py-1 text-sm font-semibold text-foreground">{section.title}</p>

      {section.items && (
        <ul className="space-y-0.5">
          {section.items.map((item) => (
            <li key={item.href}>
              <LeafLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      )}

      {section.subSections && (
        <div className="flex flex-col">
          {section.subSections.map((sub) => (
            <SubSection key={sub.title} sub={sub} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  )
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav>
      <div className="flex flex-col gap-6 py-4">
        {navSections.map((section) => (
          <Section key={section.title} section={section} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  )
}
