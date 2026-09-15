export type MapSlug =
  | 'dust2'
  | 'mirage'
  | 'inferno'
  | 'nuke'
  | 'ancient'
  | 'overpass'
  | 'anubis'

export type NadeType = 'smoke' | 'flash' | 'molotov' | 'he'

export type Side = 't' | 'ct'

/** Зачем кидается граната. Одна граната может попадать в несколько категорий. */
export type NadePurpose =
  | 'default'
  | 'execute'
  | 'fast'
  | 'instant'
  | 'retake'
  | 'resmoke'
  | 'fake'
  | 'lurk'
  | 'paired'

export interface Nade {
  /** Стабильный id, совпадает с именем папки картинок: `dd2-01`. */
  id: string
  map: MapSlug
  type: NadeType
  side: Side
  /** Откуда кидаем. */
  from: string
  /** Куда прилетает. */
  to: string
  /** Как кидаем: `LMB`, `JT`, `W + JT`… */
  throw: string
  /** `setpos_exact x y z` — без точки с запятой на конце. */
  setpos: string
  /** `setang pitch yaw roll` — без точки с запятой на конце. */
  setang: string
  /** Ключ зоны из `MapInfo.zones`. */
  zone: string
  purpose: NadePurpose[]
  /** Пути относительно BASE_URL либо абсолютные URL. */
  images: string[]
  note?: string
  /** Необязательный override; по умолчанию собирается из типа и `to`. */
  title?: string
}

/** Точка спавна: номер приоритета и команда телепорта на неё. */
export interface Spawn {
  id: string
  team: Side
  /** Номер спавна как в игре — чем меньше, тем раньше он занимается. */
  number: number
  /** Ориентир: «за ящиками», «у ворот». */
  label?: string
  setpos: string
}

/** Зона карты — свой набор на каждой карте. */
export interface NadeZone {
  id: string
  label: string
}

export interface MapInfo {
  slug: MapSlug
  label: string
  zones: NadeZone[]
  nades: Nade[]
  /** Данных по спавнам пока нет ни на одной карте. */
  spawns?: Spawn[]
}

export const NADE_TYPES: NadeType[] = ['smoke', 'flash', 'molotov', 'he']

export const NADE_TYPE_LABELS: Record<NadeType, string> = {
  smoke: 'Смок',
  flash: 'Флеш',
  molotov: 'Молотов',
  he: 'HE',
}

export const SIDES: Side[] = ['t', 'ct']

export const SIDE_LABELS: Record<Side, string> = {
  t: 'T',
  ct: 'CT',
}

export const NADE_PURPOSES: NadePurpose[] = [
  'default',
  'execute',
  'fast',
  'instant',
  'retake',
  'resmoke',
  'fake',
  'lurk',
  'paired',
]

export const NADE_PURPOSE_LABELS: Record<NadePurpose, string> = {
  default: 'Дефолт',
  execute: 'Выход',
  fast: 'Фаст',
  instant: 'Инстак',
  retake: 'Ретейк',
  resmoke: 'Ресмок',
  fake: 'Отмена',
  lurk: 'Люрк',
  paired: 'Парный',
}
