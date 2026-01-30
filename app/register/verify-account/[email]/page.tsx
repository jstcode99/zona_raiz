'use client'

import { OTPForm, typeOTP } from "@/components/otp/otp-form"
import i18next from "i18next"
import { useRouter } from "next/navigation"
import { use } from 'react'
import { toast } from "sonner"

export default function VerifyAccountPage({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  const router = useRouter()
  const { email } = use(params)


  if (!email || String(email)
    .toLowerCase()
    .match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )) {
    toast.info(i18next.t('forms.verify-account.send-verification-email'))
    return router.push('/auth/sign-in')
  }

  return (
    <OTPForm email={decodeURIComponent(email)} type={typeOTP.VERIFY} />
  )
}
