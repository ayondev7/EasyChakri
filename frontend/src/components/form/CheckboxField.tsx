import React from "react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode
  id: string
  className?: string
}

export default function CheckboxField({ label, id, className = "", ...rest }: Props) {
  return (
    <div className={className}>
      <div className="flex items-start gap-2 text-sm">
        <input id={id} type="checkbox" className="mt-1 rounded border-border" {...rest} />
        <label htmlFor={id} className="text-muted-foreground">
          {label}
        </label>
      </div>
    </div>
  )
}
