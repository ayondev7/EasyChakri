import React from "react"
import InputField from "@/components/form/InputField"
import TextareaField from "@/components/form/TextareaField"
import FileInput from "@/components/form/FileInput"
import SelectField from "@/components/form/SelectField"
import { INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS } from "@/constants"

type Props = {
  registerRecruiter: any
  errorsRecruiter: any
  companyLogoPreview: string
  handleCompanyLogoChange: (file: File | null) => void
  recruiterImagePreview: string
  handleRecruiterImageChange: (file: File | null) => void
}

export default function RecruiterForm({ registerRecruiter, errorsRecruiter, companyLogoPreview, handleCompanyLogoChange, recruiterImagePreview, handleRecruiterImageChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <InputField id="name" label="Full Name" type="text" placeholder="John Doe" {...registerRecruiter("name")} />
          {errorsRecruiter.name && <p className="text-xs text-destructive">{errorsRecruiter.name.message}</p>}
        </div>

        <div className="space-y-2">
          <InputField id="email" label="Email" type="email" placeholder="you@example.com" {...registerRecruiter("email")} />
          {errorsRecruiter.email && <p className="text-xs text-destructive">{errorsRecruiter.email.message}</p>}
        </div>

        <div className="space-y-2">
          <InputField id="password" label="Password" type="password" placeholder="••••••••" {...registerRecruiter("password")} />
          {errorsRecruiter.password && <p className="text-xs text-destructive">{errorsRecruiter.password.message}</p>}
        </div>

        <div className="space-y-2">
          <InputField id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" {...registerRecruiter("confirmPassword")} />
          {errorsRecruiter.confirmPassword && <p className="text-xs text-destructive">{errorsRecruiter.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <InputField id="companyName" label="Company Name" type="text" placeholder="Acme Corp" {...registerRecruiter('companyName' as any)} />
          {errorsRecruiter.companyName && <p className="text-xs text-destructive">{errorsRecruiter.companyName.message}</p>}
        </div>

        <div className="space-y-2">
          <TextareaField id="companyDescription" label="Company Description" placeholder="Describe your company" {...registerRecruiter('companyDescription' as any)} />
          {errorsRecruiter.companyDescription && <p className="text-xs text-destructive">{errorsRecruiter.companyDescription.message}</p>}
        </div>

        <div className="space-y-2">
          <InputField id="companyWebsite" label="Company Website (Optional)" type="url" placeholder="https://example.com" {...registerRecruiter('companyWebsite' as any)} />
          {errorsRecruiter.companyWebsite && <p className="text-xs text-destructive">{errorsRecruiter.companyWebsite.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="companyIndustry" className="block text-sm font-medium">Industry</label>
          <SelectField
            options={INDUSTRY_OPTIONS}
            placeholder="Select industry"
            {...registerRecruiter('companyIndustry')}
          />
          {errorsRecruiter.companyIndustry && <p className="text-xs text-destructive">{errorsRecruiter.companyIndustry.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="companySize" className="block text-sm font-medium">Company Size</label>
          <SelectField
            options={COMPANY_SIZE_OPTIONS}
            placeholder="Select company size"
            {...registerRecruiter('companySize')}
          />
          {errorsRecruiter.companySize && <p className="text-xs text-destructive">{errorsRecruiter.companySize.message}</p>}
        </div>

        <div className="space-y-2">
          <InputField id="companyLocation" label="Company Location" type="text" placeholder="City, Country" {...registerRecruiter('companyLocation' as any)} />
          {errorsRecruiter.companyLocation && <p className="text-xs text-destructive">{errorsRecruiter.companyLocation.message}</p>}
        </div>

        <div className="space-y-2">
          <FileInput id="companyLogo" label="Company Logo" accept=".jpg,.jpeg,.png,.webp" onFileChange={handleCompanyLogoChange} preview={companyLogoPreview} />
          <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
        </div>

        <div className="space-y-2 mt-3">
          <FileInput id="recruiterImage" label="Profile Image" accept=".jpg,.jpeg,.png,.webp" onFileChange={handleRecruiterImageChange} preview={recruiterImagePreview} />
          <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
        </div>
      </div>
    </div>
  )
}
