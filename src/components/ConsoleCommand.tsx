import { Check,Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConsoleCommandProps {
  text: string;
  label?: string;
  className?: string;
}

export function ConsoleCommand({ text, label, className }: ConsoleCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Не удалось скопировать', err);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-emerald-400 transition-all duration-200',
        copied && 'border-emerald-500 ring-2 ring-emerald-500/30',
        className
      )}
    >
      {label && (
        <div className="mb-2 text-xs uppercase tracking-widest text-zinc-500">
          {label}
        </div>
      )}
      <pre className="whitespace-pre-wrap break-all text-wrap">{text}</pre>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 h-8 w-8 text-zinc-400 hover:text-white"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}