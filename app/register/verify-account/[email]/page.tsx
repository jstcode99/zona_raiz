'use client'

import { VerifyAccountForm } from "@/app/components/register/verify-account-form"
import { use } from 'react'

export default function VerifyAccountPage({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  const { email } = use(params)

  return (
    <VerifyAccountForm email={email}/>
  )
}
