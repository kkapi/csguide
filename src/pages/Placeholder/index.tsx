import { useLocation } from 'react-router-dom'

import { navSections } from '@/config/nav'

function findTitle(pathname: string): string {
  for (const section of navSections) {
    for (const item of section.items ?? []) {
      if (item.href === pathname) return item.title
    }
    for (const sub of section.subSections ?? []) {
      for (const item of sub.items) {
        if (item.href === pathname) return `${sub.title} — ${item.title}`
      }
    }
  }
  return 'Страница'
}

export function Placeholder() {
  const { pathname } = useLocation()
  const title = findTitle(pathname)

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">Скоро здесь появится контент.</p>
    </div>
  )
}
