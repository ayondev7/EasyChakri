"use client"

import Image from "next/image"
import { useState } from "react"
import { getInitials } from "@/utils/utils"
import { cn } from "@/lib/utils"

interface CustomAvatarProps {
  src?: string | null
  name?: string
  alt?: string
  size?: number
  className?: string
}

export default function CustomAvatar({
  src,
  name,
  alt,
  size = 40,
  className,
}: CustomAvatarProps) {
  const [hasError, setHasError] = useState(false)
  const initials = getInitials(name || alt || "")
  const wrapperStyle = { width: size, height: size }

  return (
    <div
      style={wrapperStyle}
      className={cn(
        "rounded-full overflow-hidden bg-emerald-500/10 flex items-center justify-center flex-shrink-0",
        className
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt || name || "avatar"}
          width={size}
          height={size}
          className="object-cover"
          unoptimized
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-sm font-semibold text-emerald-500">{initials}</span>
      )}
    </div>
  )
}
