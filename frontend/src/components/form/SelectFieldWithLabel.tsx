"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Option {
  label: string
  value: string
}

interface SelectFieldWithLabelProps {
  id: string
  label?: string
  options: Option[]
  name?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export default function SelectFieldWithLabel({
  id,
  label,
  options,
  name,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  required = false,
  disabled = false,
}: SelectFieldWithLabelProps) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && "*"}
        </Label>
      )}
      <Select name={name} value={value} onValueChange={onChange} required={required} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
