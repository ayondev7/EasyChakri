import React from "react"
import FormCard from "@/components/form/FormCard"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import CheckboxField from "@/components/form/CheckboxField"

type Props = {
  role: "seeker" | "recruiter"
  isLoading: boolean
  onSubmit: (e?: any) => void
  checkboxRegister: any
  checkboxError?: any
  footerExtra?: React.ReactNode
  children?: React.ReactNode
}

export default function SignUpCard({ role, isLoading, onSubmit, checkboxRegister, checkboxError, footerExtra, children }: Props) {
  const footer = (
    <>
      <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {footerExtra}
    </>
  )

  return (
    <FormCard title="Sign Up" description={role === "seeker" ? "Create your job seeker account to start applying" : "Create your recruiter account and company profile to post jobs"} footer={footer}>
      {children}
      <div className="flex items-start gap-2 text-sm">
        <CheckboxField id="terms" label={<>
          I agree to the{' '}
          <a href="/terms" className="text-emerald-500 hover:underline">Terms of Service</a>{' '}and{' '}
          <a href="/privacy" className="text-emerald-500 hover:underline">Privacy Policy</a>
        </>} {...checkboxRegister} />
        {checkboxError && (
          <p className="text-xs text-destructive">{checkboxError.message}</p>
        )}
      </div>
    </FormCard>
  )
}
