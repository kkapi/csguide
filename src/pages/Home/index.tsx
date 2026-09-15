import { ArrowRight, Bomb, Settings2, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

import { maps } from '@/data/maps'
import { useLearnedNades } from '@/features/nades/useLearnedNades'

const links = [
  {
    to: '/training/nades',
    icon: Target,
    title: 'Тренировка гранат',
    text: 'Случайная выборка, команда сразу в буфере, отметка «выучено».',
  },
  {
    to: '/maps/dust2/nades',
    icon: Bomb,
    title: 'Гранаты Dust2',
    text: 'Раскид с фильтрами по типу, стороне, зоне и назначению.',
  },
  {
    to: '/training/setup',
    icon: Settings2,
    title: 'Настройка сервера',
    text: 'Команды для тренировочного сервера, биндов и ножей.',
  },
]

export function Home() {
  const { countLearned } = useLearnedNades()
  const allNades = Object.values(maps).flatMap((m) => m.nades)

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CS Guide</h1>
        <p className="mt-1 text-muted-foreground">
          Раскиды и тактики для соревновательных карт CS2. Выучено{' '}
          {countLearned(allNades)} из {allNades.length} гранат.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map(({ to, icon: Icon, title, text }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col gap-1.5 rounded-xl border p-4 transition-colors hover:border-muted-foreground/40"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-primary" />
              <span className="font-medium">{title}</span>
              <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-sm text-muted-foreground">{text}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
