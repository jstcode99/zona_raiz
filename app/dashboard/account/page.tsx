import { AccountForm } from "@/components/account/account-form"
import { AvatarUpload } from "@/components/account/avatar-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAccountProfileController } from "@/modules/account/controllers/account.controller"
import { redirect } from 'next/navigation'

export default async function Account() {
  const response = await getAccountProfileController()

  if (!response.ok || !response.data) {
    redirect("/dashboard")
  }

  const profile = response.data

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
              ok: true,
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
