import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { SidebarNav } from './SidebarNav'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="flex w-64 flex-col p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>CS Guide</SheetTitle>
        </SheetHeader>
        <div className="scrollbar-hidden flex-1 overflow-y-auto px-4">
          <SidebarNav onNavigate={onClose} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
