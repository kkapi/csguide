import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";

import { ConsoleCommand } from "@/components/ConsoleCommand";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Nade } from "@/data/types";
import { cn } from "@/lib/utils";

import { NadeTypeBadge } from "./NadeTypeBadge";

function NadeImageGallery({ nade }: { nade: Nade }) {
  const [imgIndex, setImgIndex] = useState(0);

  if (nade.images.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-zinc-700">
        <ImageIcon className="h-12 w-12" />
      </div>
    );
  }

  return (
    <>
      <img
        src={nade.images[imgIndex]}
        alt={`${nade.title} — фото ${imgIndex + 1}`}
        className="h-full w-full object-cover"
      />

      {nade.images.length > 1 && (
        <>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {nade.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setImgIndex(i);
                }}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === imgIndex ? "bg-white" : "bg-white/40",
                )}
              />
            ))}
          </div>
          {imgIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImgIndex((i) => i - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {imgIndex < nade.images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImgIndex((i) => i + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </>
      )}
    </>
  );
}

interface NadeModalProps {
  nade: Nade | null;
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function NadeModal({
  nade,
  open,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: NadeModalProps) {
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <DialogContent
          showCloseButton
          className="sm:max-w-screen-2xl p-0 overflow-hidden gap-0"
        >
          {/* Скрытый заголовок для доступности */}
          <DialogTitle className="sr-only">{nade?.title}</DialogTitle>

          {nade && (
            <div className="flex flex-col md:grid md:grid-cols-[5fr_2fr] md:h-[min(85vh,720px)]">
              {/* Панель изображения */}
              <div className="relative aspect-video md:aspect-auto md:h-full bg-zinc-800/60 overflow-hidden">
                <NadeImageGallery key={nade.id} nade={nade} />
              </div>

              {/* Панель деталей */}
              <div className="flex flex-col border-t md:border-t-0 md:border-l border-zinc-800 md:overflow-hidden">
                {/* Шапка */}
                <div className="shrink-0 p-5 pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2 mb-1 pr-6">
                    <NadeTypeBadge type={nade.type} />
                    <h2 className="text-base font-semibold leading-tight">
                      {nade.title}
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {nade.from} → {nade.to}
                  </p>
                </div>

                {/* Контент — скроллится на десктопе */}
                <div className="flex flex-col gap-4 p-5 md:overflow-y-auto md:flex-1">
                  {nade.description && (
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {nade.description}
                    </p>
                  )}

                  {nade.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {nade.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Бросок:</span>
                    <span className="font-mono text-zinc-200">
                      {nade.throw}
                    </span>
                  </div>

                  <ConsoleCommand
                    text={nade.command}
                    splitOnSemicolon
                    label="Команда для консоли"
                  />
                </div>

                {/* Навигация */}
                {(hasPrev || hasNext) && (
                  <div className="shrink-0 flex justify-between border-t border-zinc-800 px-5 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onPrev}
                      disabled={!hasPrev}
                      className="text-zinc-400"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Предыдущая
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onNext}
                      disabled={!hasNext}
                      className="text-zinc-400"
                    >
                      Следующая
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
