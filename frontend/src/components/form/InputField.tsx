import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Props = React.ComponentProps<typeof Input> & {
  label?: string
  id: string
  className?: string
}

export default function InputField({ label, id, className = "", ...rest }: Props) {
  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} {...rest} />
    </div>
  )
}
