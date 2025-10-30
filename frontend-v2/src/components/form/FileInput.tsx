import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import toast from "react-hot-toast"
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, FILE_VALIDATION_MESSAGES } from "@/constants/fileConstants"

type Props = {
  label?: string
  id: string
  className?: string
  accept?: string
  onFileChange?: (file: File | null) => void
  preview?: string
}

export default function FileInput({ label, id, className = "", accept, onFileChange, preview }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      onFileChange?.(null)
      return
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(FILE_VALIDATION_MESSAGES.invalidType)
      e.target.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(FILE_VALIDATION_MESSAGES.sizeTooLarge)
      e.target.value = ""
      return
    }

    onFileChange?.(file)
  }

  return (
    <div className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input id={id} type="file" accept={accept} onChange={handleChange} />
      {preview && (
        <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
      )}
    </div>
  )
}

