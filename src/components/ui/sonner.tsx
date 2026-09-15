import { Toaster as Sonner, type ToasterProps } from 'sonner'

/**
 * Тему sonner не прокидываем: `useTheme` держит состояние в каждом вызове,
 * второй потребитель рассинхронизировался бы с переключателем в шапке.
 * Цвета берём из CSS-переменных, они и так меняются вместе с классом `.dark`.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}
