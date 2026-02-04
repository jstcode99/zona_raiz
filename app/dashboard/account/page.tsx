import { AccountForm } from "@/components/account/account-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAccountProfileController } from "@/modules/account/controllers/account.controller"
import { redirect } from 'next/navigation'

export default async function Account() {
  const profile = await getAccountProfileController()

  if (!profile) redirect('/auth/sign-in')

  return (
    <div className='flex items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <Card className='w-full border-none shadow-md sm:max-w-lg'>
        <CardHeader className='gap-6'>
          {/* <Logo className='gap-3' /> */}
        </CardHeader>

        <CardContent>
          {/* Register Form */}
          <div className='space-y-4'>
            <AccountForm defaultValues={{
              name: profile.ok ? profile.data?.name || '' : '',
              last_name: profile.ok ? profile.data?.last_name || '' : '',
              phone: profile.ok ? profile.data?.phone || '' : '',
            }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
