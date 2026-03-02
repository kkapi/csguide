import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConsoleCommandProps {
  text: string;
  label?: string;
  className?: string;
  /** Делать перенос строки после каждого символа `;` */
  splitOnSemicolon?: boolean;
}

export function ConsoleCommand({
  text,
  label,
  className,
  splitOnSemicolon = false,
}: ConsoleCommandProps) {
  const [copied, setCopied] = useState(false);

  // Форматируем текст для отображения (если включено разбиение)
  const displayText = splitOnSemicolon
    ? text.replace(/;/g, ';\n')
    : text;

  const handleCopy = async () => {
    try {
      // Всегда копируем оригинальный текст без искусственных переносов
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Не удалось скопировать текст', err);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border border-zinc-800 bg-zinc-950/70 font-mono text-sm text-emerald-400/95',
        'p-5 pr-16',
        'transition-all duration-200',
        copied && 'border-emerald-600/60 ring-2 ring-emerald-500/20 bg-zinc-950',
        className
      )}
    >
      {label && (
        <div className="mb-2.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </div>
      )}

      <pre className="whitespace-pre-wrap break-words leading-relaxed text-yellow-300/65">
        {displayText}
      </pre>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute right-4 top-4 z-10',
          'h-9 w-9 rounded-full',
          'text-zinc-400 hover:text-white',
          'hover:bg-zinc-800/70 active:bg-zinc-700/70',
          'transition-colors',
          copied && 'text-emerald-400 hover:text-emerald-300'
        )}
        onClick={handleCopy}
        aria-label={copied ? 'Скопировано' : 'Скопировать команду'}
      >
        {copied ? (
          <Check className="h-5 w-5" />
        ) : (
          <Copy className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}