import { dust2Zones } from '@/data/maps/dust2/meta'
import { dust2Nades } from '@/data/maps/dust2/nades'
import { mirageZones } from '@/data/maps/mirage/meta'
import { mirageNades } from '@/data/maps/mirage/nades'
import type { MapInfo, MapSlug } from '@/data/types'

/**
 * Карты, у которых есть данные. Карта, которой тут нет, показывает пустую
 * страницу — так навигация не ломается, пока данные не завезли.
 */
export const maps: Partial<Record<MapSlug, MapInfo>> = {
  dust2: {
    slug: 'dust2',
    label: 'Dust2',
    zones: dust2Zones,
    nades: dust2Nades,
  },
  mirage: {
    slug: 'mirage',
    label: 'Mirage',
    zones: mirageZones,
    nades: mirageNades,
  },
}

/** Человекочитаемые названия всех карт, включая те, где данных ещё нет. */
export const MAP_LABELS: Record<MapSlug, string> = {
  dust2: 'Dust2',
  mirage: 'Mirage',
  inferno: 'Inferno',
  nuke: 'Nuke',
  ancient: 'Ancient',
  overpass: 'Overpass',
  anubis: 'Anubis',
}

export const MAP_SLUGS = Object.keys(MAP_LABELS) as MapSlug[]

export function getMap(slug: string | undefined): MapInfo | undefined {
  return slug ? maps[slug as MapSlug] : undefined
}

export function isMapSlug(slug: string | undefined): slug is MapSlug {
  return !!slug && slug in MAP_LABELS
}
