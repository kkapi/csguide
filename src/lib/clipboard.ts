import { toast } from 'sonner'

/** Один и тот же id — новое уведомление заменяет предыдущее, а не копит стопку. */
const TOAST_ID = 'clipboard'

/**
 * Единственная точка копирования в приложении: пишет в буфер и показывает
 * уведомление в углу экрана.
 *
 * Возвращает `false`, если браузер отказал — это штатная ситуация при попытке
 * скопировать без клика пользователя (Firefox и Safari так делают всегда).
 * Вызывающий код должен уметь пережить отказ, а не считать копирование данностью.
 */
export async function copyToClipboard(
  text: string,
  label = 'Скопировано',
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(label, { id: TOAST_ID })
    return true
  } catch {
    return false
  }
}
