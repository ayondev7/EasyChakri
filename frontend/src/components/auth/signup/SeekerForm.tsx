import React from "react"
import InputField from "@/components/form/InputField"
import FileInput from "@/components/form/FileInput"

type Props = {
  registerSeeker: any
  errorsSeeker: any
  seekerImagePreview: string
  handleSeekerImageChange: (file: File | null) => void
}

export default function SeekerForm({ registerSeeker, errorsSeeker, seekerImagePreview, handleSeekerImageChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <InputField id="name" label="Full Name" type="text" placeholder="John Doe" {...registerSeeker("name")} />
        {errorsSeeker.name && <p className="text-xs text-destructive">{errorsSeeker.name.message}</p>}
      </div>

      <div className="space-y-2">
        <InputField id="email" label="Email" type="email" placeholder="you@example.com" {...registerSeeker("email")} />
        {errorsSeeker.email && <p className="text-xs text-destructive">{errorsSeeker.email.message}</p>}
      </div>

      <div className="space-y-2">
        <InputField id="password" label="Password" type="password" placeholder="••••••••" {...registerSeeker("password")} />
        {errorsSeeker.password && <p className="text-xs text-destructive">{errorsSeeker.password.message}</p>}
      </div>

      <div className="space-y-2">
        <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" {...registerSeeker("confirmPassword")} />
        {errorsSeeker.confirmPassword && <p className="text-xs text-destructive">{errorsSeeker.confirmPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <InputField id="dateOfBirth" label="Date of Birth" type="date" {...registerSeeker("dateOfBirth" as any)} />
        {errorsSeeker.dateOfBirth && <p className="text-xs text-destructive">{errorsSeeker.dateOfBirth.message}</p>}
      </div>

      <div className="space-y-2">
        <InputField id="phone" label="Phone" type="tel" placeholder="(123) 456-7890" {...registerSeeker("phone" as any)} />
        {errorsSeeker.phone && <p className="text-xs text-destructive">{errorsSeeker.phone.message}</p>}
      </div>

      <div className="space-y-2 col-span-2">
        <FileInput id="seekerImage" label="Profile Image" accept=".jpg,.jpeg,.png,.webp" onFileChange={handleSeekerImageChange} preview={seekerImagePreview} />
        <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
      </div>
    </div>
  )
}
