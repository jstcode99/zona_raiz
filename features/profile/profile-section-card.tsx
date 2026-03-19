"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ComponentProps } from 'react'
import { AvatarUpload } from "@/features/profile/avatar-upload"
import { ProfileForm } from "@/features/profile/profile-form"
import { ProfileEntity } from '@/domain/entities/profile.entity'
import { useTranslation } from 'react-i18next'

export default function ProfileSectionCard({
    className,
    defaultValues,
    ...props
}: ComponentProps<"div"> & {
    defaultValues: ProfileEntity
}) {
    const { t } = useTranslation('profile')

    return (
        <Card className='z-1 w-full border-none sm:max-w-md' {...props}>
            <CardHeader className='gap-2'>
                <CardTitle className='text-xl'>{t('title')}</CardTitle>
                <CardDescription className='text-base'>
                    {t('subtitle')}
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
