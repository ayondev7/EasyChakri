"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderFieldProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  marks?: { value: number; label: string }[]
  className?: string
  disabled?: boolean
}

const SliderField: React.FC<SliderFieldProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks = [],
  className = "",
  disabled = false,
}) => {
  const handleValueChange = (values: number[]) => {
    onChange(values[0])
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      
      {marks.length > 0 && (
        <div className="relative w-full">
          <div className="flex justify-between text-xs text-muted-foreground">
            {marks.map((mark) => (
              <span key={mark.value}>{mark.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SliderField
