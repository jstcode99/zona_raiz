"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserWithProfile } from '@/domain/entities/User'
import i18next from "i18next"
import { ComponentProps } from 'react'
import { AvatarUpload } from "@/features/account/avatar-upload"
import { AccountForm } from "@/features/account/account-form"

export default function AccountSectionCard({
  className,
  defaultValues,
  ...props
}: ComponentProps<"div"> & {
  defaultValues: UserWithProfile
}) {
    return (
        <Card className='z-1 w-full border-none sm:max-w-md' { ...props}>
            <CardHeader className='gap-2'>
                <CardTitle className='text-xl'>{i18next.t('forms.profile.title')}</CardTitle>
                <CardDescription className='text-base'>
                    {i18next.t('forms.profile.subtitle')}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="px-6 max-w-35 mx-auto flex items-center relative">
                    <AvatarUpload
                        avatarUrl={defaultValues.profile.avatar_url || ''}
                        full_name={defaultValues.profile.full_name || ''}
                    />
                </div>
                <AccountForm defaultValues={{
                    full_name: defaultValues.profile.full_name || '',
                    phone: defaultValues.profile.phone || '',
                }} />
            </CardContent>
        </Card>
    )
}
