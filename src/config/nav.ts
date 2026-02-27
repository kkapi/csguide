export interface NavLeafItem {
  title: string
  href: string
}

export interface NavSubSection {
  title: string
  defaultOpen?: boolean
  items: NavLeafItem[]
}

// Секция — просто заголовок, внутри либо прямые ссылки, либо коллапсируемые подразделы
export interface NavSection {
  title: string
  items?: NavLeafItem[]
  subSections?: NavSubSection[]
}

export const navSections: NavSection[] = [
  {
    title: 'О проекте',
    items: [
      { title: 'Введение', href: '/' },
      { title: 'О нас', href: '/about' },
    ],
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
    title: 'Карты',
    subSections: [
      {
        title: 'Dust2',
        items: [
          { title: 'Дефолт', href: '/maps/dust2/default' },
          { title: 'Раскид', href: '/maps/dust2/smokes' },
          { title: 'Раунды', href: '/maps/dust2/rounds' },
          { title: 'Позиции', href: '/maps/dust2/positions' },
          { title: 'Фишки', href: '/maps/dust2/tips' },
        ],
      },
      {
        title: 'Mirage',
        items: [
          { title: 'Дефолт', href: '/maps/mirage/default' },
          { title: 'Раскид', href: '/maps/mirage/smokes' },
          { title: 'Раунды', href: '/maps/mirage/rounds' },
          { title: 'Позиции', href: '/maps/mirage/positions' },
          { title: 'Фишки', href: '/maps/mirage/tips' },
        ],
      },
      {
        title: 'Inferno',
        items: [
          { title: 'Дефолт', href: '/maps/inferno/default' },
          { title: 'Раскид', href: '/maps/inferno/smokes' },
          { title: 'Раунды', href: '/maps/inferno/rounds' },
          { title: 'Позиции', href: '/maps/inferno/positions' },
          { title: 'Фишки', href: '/maps/inferno/tips' },
        ],
      },
      {
        title: 'Nuke',
        items: [
          { title: 'Дефолт', href: '/maps/nuke/default' },
          { title: 'Раскид', href: '/maps/nuke/smokes' },
          { title: 'Раунды', href: '/maps/nuke/rounds' },
          { title: 'Позиции', href: '/maps/nuke/positions' },
          { title: 'Фишки', href: '/maps/nuke/tips' },
        ],
      },
    ],
  },
  {
    title: 'Тренировка',
    items: [
      { title: 'Настройка', href: '/training/setup' },
      { title: 'Аим-тренировки', href: '/training/aim' },
      { title: 'Мастерские карты', href: '/training/workshop' },
    ],
  },
]
