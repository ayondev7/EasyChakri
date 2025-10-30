import React from "react"
import FormCard from "@/components/form/FormCard"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type Props = {
  isLoading: boolean
  onSubmit: (e?: any) => void
  footer?: React.ReactNode
  children?: React.ReactNode
}

export default function SignInCard({ isLoading, onSubmit, footer, children }: Props) {
  const cardFooter = (
    <>
      <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      {footer}
    </>
  )

  return (
    <FormCard title="Sign In" description="Access your account" footer={cardFooter}>
      {children}
    </FormCard>
  )
}
