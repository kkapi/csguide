import { type Nade, NADE_TYPE_LABELS } from '@/data/types'

/**
 * Команда для консоли. `setang` отключаемый: без него телепорт ставит на точку,
 * но не трогает прицел — удобно, когда хочешь довести его руками.
 */
export function buildCommand(nade: Nade, withSetang: boolean): string {
  return withSetang ? `${nade.setpos};${nade.setang}` : nade.setpos
}

/** Заголовок гранаты: свой, если задан, иначе «Смок двери б». */
export function nadeTitle(nade: Nade): string {
  return nade.title ?? `${NADE_TYPE_LABELS[nade.type]} ${nade.to}`
}

/**
 * Абсолютные URL отдаём как есть, относительные клеим с BASE_URL — иначе
 * картинки сломаются либо в dev (`/`), либо на Pages (`/csguide/`).
 */
export function nadeImageUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
