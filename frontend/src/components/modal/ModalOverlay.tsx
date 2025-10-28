"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ModalOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  maxHeight?: string
}

export function ModalOverlay({
  open,
  onOpenChange,
  trigger,
  title,
  icon,
  children,
  className = "sm:max-w-[500px]",
  maxHeight = "max-h-[70vh]"
}: ModalOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className={`${className} ${maxHeight} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
