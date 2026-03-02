export const NADE_TAGS = [
  // Сторона
  't-side',
  'ct-side',
  // Сайт
  'a-site',
  'b-site',
  'mid',
  // Особенности
  'instant',
  'retake',
] as const

export type NadeTag = (typeof NADE_TAGS)[number]

export type NadeType = 'smoke' | 'flash' | 'molotov' | 'he'

export interface Nade {
  id: string
  title: string
  type: NadeType
  from: string
  to: string
  throw: string
  command: string
  tags: NadeTag[]
  images: string[]
  description?: string
}
