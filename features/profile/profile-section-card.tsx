"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import i18next from "i18next"
import { ComponentProps } from 'react'
import { AvatarUpload } from "@/features/profile/avatar-upload"
import { ProfileForm } from "@/features/profile/profile-form"
import { ProfileEntity } from '@/domain/entities/profile.entity'

export default function ProfileSectionCard({
  className,
  defaultValues,
  ...props
}: ComponentProps<"div"> & {
  defaultValues: ProfileEntity
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
                        avatarUrl={defaultValues.avatar_url || ''}
                        full_name={defaultValues.full_name || ''}
                    />
                </div>
                <ProfileForm defaultValues={{
                    full_name: defaultValues.full_name || '',
                    phone: defaultValues.phone || '',
                }} />
            </CardContent>
        </Card>
    )
}
