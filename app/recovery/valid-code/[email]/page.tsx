import { SendCodeForm } from "@/app/components/recovery/send-code-form"
import { use } from 'react'

export default function RecoveryValidCodePage({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  const { email } = use(params)

  return (
    <SendCodeForm />
  )
}
