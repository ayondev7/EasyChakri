"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabOption {
  label: string
  value: string
  count?: number
}

interface TabsFieldProps {
  options: TabOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  fullWidth?: boolean
}

export default function TabsField({
  options,
  value,
  onChange,
  className = "",
  fullWidth = false,
}: TabsFieldProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className={className}>
      <TabsList className={fullWidth ? `grid grid-cols-${options.length} w-full` : ""}>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined && ` (${option.count})`}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
