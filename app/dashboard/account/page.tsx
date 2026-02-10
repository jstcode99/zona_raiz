import { AvatarUpload } from "@/features/account/avatar-upload"
import { AccountForm } from "@/features/account/account-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { redirect } from 'next/navigation'
import { getCurrentProfile } from "@/shared/auth/getCurrentProfile"

export default async function Account() {

  const profile = await getCurrentProfile()
  
  if (!profile) {
    redirect("/auth/sign-in")
  }

  return (
    <div className='flex items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <Card className='w-full border-none shadow-md sm:max-w-lg'>
        <CardHeader className='gap-6 items-center px-6 pt-6 md:px-8'>
          <AvatarUpload
            avatarUrl={profile?.avatar_url || null}
            name={profile?.name || ''}
          />
        </CardHeader>

        <CardContent>
          <div className='space-y-4'>
            <AccountForm defaultValues={{
              name: profile?.name || '',
              last_name: profile?.last_name || '',
              phone: profile?.phone || '',
            }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
