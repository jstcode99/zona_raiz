'use client'

import { EmailOTPForm } from '@/components/otp/email-otp-form'
import { OTPForm, typeOTP } from '@/components/otp/otp-form'
import { useState } from 'react'

export default function OTPPage() {
  const [email, setEmail] = useState<string>('')

  if (email === '') {
    return (
      <EmailOTPForm
        className='translate-x-0 transition-all duration-500 ease-in-out'
        type={typeOTP.AUTH}
        onOTPGenerated={(e) => setEmail(e)}
      />

    )
  }
  return (
    <OTPForm
      className='translate-x-0 transition-all duration-500 ease-in-out'
      email={email}
      type={typeOTP.VERIFY}
    />
  )
}
