import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { copyToClipboard } from '@/lib/clipboard'
import { cn } from '@/lib/utils'

interface ConsoleCommandProps {
  text: string
  label?: string
  className?: string
  /** Делать перенос строки после каждого символа `;` */
  splitOnSemicolon?: boolean
  /**
   * Подсветить кнопку копирования. Нужно там, где скопировать автоматически
   * не удалось и человеку надо показать, куда нажать.
   */
  attention?: boolean
  /** Внешний сигнал «скопировано» — для автокопирования мимо этой кнопки. */
  copied?: boolean
}

export function ConsoleCommand({
  text,
  label,
  className,
  splitOnSemicolon = false,
  attention = false,
  copied: copiedExternally = false,
}: ConsoleCommandProps) {
  const [copiedHere, setCopiedHere] = useState(false)
  const copied = copiedHere || copiedExternally

  // Показываем с переносами, а копируем всегда одной строкой.
  const displayText = splitOnSemicolon ? text.replace(/;/g, ';\n') : text

  // В однострочном блоке кнопка встаёт по центру: прижатая к верху, она
  // выглядит съехавшей. В многострочном верх — единственное разумное место.
  const singleLine = !label && !displayText.includes('\n')

  const handleCopy = async () => {
    const ok = await copyToClipboard(text, 'Команда скопирована')
    if (!ok) return
    setCopiedHere(true)
    setTimeout(() => setCopiedHere(false), 1800)
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border border-zinc-800 bg-zinc-950/70 font-mono text-sm text-emerald-400/95',
        'p-5 pr-16',
        'transition-all duration-200',
        copied && 'border-emerald-600/60 bg-zinc-950 ring-2 ring-emerald-500/20',
        className,
      )}
    >
      {label && (
        <div className="mb-2.5 text-xs font-medium tracking-wider text-zinc-500 uppercase">
          {label}
        </div>
      )}

      <pre className="leading-relaxed whitespace-pre-wrap break-words text-yellow-300/65">
        {displayText}
      </pre>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute z-10',
          singleLine ? 'top-1/2 right-2 -translate-y-1/2' : 'top-4 right-4',
          'size-9 rounded-full',
          'text-zinc-400 hover:text-white',
          'hover:bg-zinc-800/70 active:bg-zinc-700/70',
          'transition-colors',
          copied && 'text-emerald-400 hover:text-emerald-300',
          attention && !copied && 'text-primary ring-2 ring-primary/50 animate-pulse',
        )}
        onClick={handleCopy}
        aria-label={copied ? 'Скопировано' : 'Скопировать команду'}
      >
        {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
      </Button>
    </div>
  )
}
