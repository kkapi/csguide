import { MAP_LABELS } from '@/data/maps'
import type { MapSlug } from '@/data/types'

export interface NavLeafItem {
  title: string
  href: string
}

export interface NavSubSection {
  title: string
  defaultOpen?: boolean
  items: NavLeafItem[]
  /** Заполнено у карт — по нему рисуется бейдж «выучено / всего». */
  mapSlug?: MapSlug
}

/** Секция — заголовок, внутри либо прямые ссылки, либо коллапсируемые подразделы. */
export interface NavSection {
  title: string
  items?: NavLeafItem[]
  subSections?: NavSubSection[]
}

/** Сначала карты, по которым есть данные. */
const MAP_ORDER: MapSlug[] = [
  'dust2',
  'mirage',
  'inferno',
  'nuke',
  'ancient',
  'overpass',
  'anubis',
]

function mapSubSection(slug: MapSlug): NavSubSection {
  return {
    title: MAP_LABELS[slug],
    mapSlug: slug,
    items: [
      { title: 'Гранаты', href: `/maps/${slug}/nades` },
      { title: 'Дефолт', href: `/maps/${slug}/default` },
      { title: 'Позиции', href: `/maps/${slug}/positions` },
      { title: 'Раунды', href: `/maps/${slug}/rounds` },
      { title: 'Фишки', href: `/maps/${slug}/tips` },
      { title: 'Респавны', href: `/maps/${slug}/spawns` },
    ],
  }
}

export const navSections: NavSection[] = [
  {
    title: 'Тренировка',
    items: [
      { title: 'Тренировка гранат', href: '/training/nades' },
      { title: 'Настройка сервера', href: '/training/setup' },
      { title: 'Аим-тренировки', href: '/training/aim' },
      { title: 'Мастерские карты', href: '/training/workshop' },
    ],
  },
  {
    title: 'Карты',
    subSections: MAP_ORDER.map(mapSubSection),
  },
  {
    title: 'Базовые механики',
    items: [
      { title: 'Движение', href: '/mechanics/movement' },
      { title: 'Прицеливание', href: '/mechanics/aim' },
      { title: 'Оружие', href: '/mechanics/weapons' },
      { title: 'Экономика', href: '/mechanics/economy' },
    ],
  },
  {
    title: 'О проекте',
    items: [
      { title: 'Введение', href: '/' },
      { title: 'О нас', href: '/about' },
    ],
  },
]
