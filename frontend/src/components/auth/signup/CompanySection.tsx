import React from "react"
import TextareaField from "@/components/form/TextareaField"
import InputField from "@/components/form/InputField"
import FileInput from "@/components/form/FileInput"

type Props = {
  register: any
  errors: any
  onLogoChange: (file: File | null) => void
  logoPreview?: string
}

export default function CompanySection({ register, errors, onLogoChange, logoPreview }: Props) {
  return (
    <>
      <div className="border-t pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
      </div>

      <div className="space-y-2">
        <InputField id="companyName" label="Company Name" placeholder="Tech Corp Inc." {...register("companyName")} />
        {errors.companyName && (
          <p className="text-xs text-destructive">{errors.companyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <TextareaField id="companyDescription" label="Company Description" placeholder="Tell us about your company..." className="min-h-[100px]" {...register("companyDescription")} />
        {errors.companyDescription && (
          <p className="text-xs text-destructive">{errors.companyDescription.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <InputField id="companyIndustry" label="Industry" placeholder="Technology" {...register("companyIndustry")} />
          {errors.companyIndustry && (
            <p className="text-xs text-destructive">{errors.companyIndustry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <InputField id="companySize" label="Company Size" placeholder="50-100" {...register("companySize")} />
          {errors.companySize && (
            <p className="text-xs text-destructive">{errors.companySize.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <InputField id="companyLocation" label="Location" placeholder="New York, USA" {...register("companyLocation")} />
        {errors.companyLocation && (
          <p className="text-xs text-destructive">{errors.companyLocation.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <InputField id="companyWebsite" label="Website (Optional)" type="url" placeholder="https://example.com" {...register("companyWebsite")} />
        {errors.companyWebsite && (
          <p className="text-xs text-destructive">{errors.companyWebsite.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <FileInput id="companyLogo" label="Company Logo (Optional)" accept=".jpg,.jpeg,.png,.webp" onFileChange={onLogoChange} preview={logoPreview} />
        <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP (Max 3MB)</p>
      </div>
    </>
  )
}
