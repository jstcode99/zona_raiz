import { AvatarUpload } from "@/features/account/avatar-upload"
import { AccountForm } from "@/features/account/account-form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { getCurrentProfile } from "@/shared/auth/getCurrentProfile"
import { encodedRedirect } from "@/shared/redirect"

export default async function Account() {

  const data = await getCurrentProfile()

  if (!data || !data.profile) {
    return encodedRedirect('error', '/dashboard/account', 'No se pudo cargar el perfil')
  }

  return (
    <div className='flex-col items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <Card className='w-full flex-col border-none shadow-md sm:max-w-lg'>
        <CardHeader className='gap-6 items-center px-6 pt-6 md:px-8'>
          <AvatarUpload
            avatarUrl={data?.profile.avatar_url || ''}
            name={data?.profile.name || ''}
          />
        </CardHeader>

        <CardContent>
          <div className='space-y-4'>
            <AccountForm defaultValues={{
              name: data?.profile.name || '',
              last_name: data?.profile.last_name || '',
              phone: data?.profile.phone || '',
            }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
