import React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Props = React.ComponentProps<typeof Textarea> & {
  label?: string
  id: string
  className?: string
}

export default function TextareaField({ label, id, className = "", ...rest }: Props) {
  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} {...rest} />
    </div>
  )
}
