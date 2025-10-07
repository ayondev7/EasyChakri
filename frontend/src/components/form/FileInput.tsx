import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  id: string
  className?: string
}

export default function FileInput({ label, id, className = "", ...rest }: Props) {
  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} type="file" {...rest} />
    </div>
  )
}
