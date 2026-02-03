import AccountForm from '@/components/account/account-form'
import { createSupabaseBrowser } from '@/infrastructure/db/supabase.browser'
import { User } from '@/modules/user/user.types'

export default async function Account() {
  const supabase = createSupabaseBrowser()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser?.id)
    .single()

  const user: User | null = authUser && userProfile && authUser.email
    ? {
        ...authUser,
        email: authUser.email, // Ensure email is always a string
        name: userProfile.name,
        createdAt: userProfile.created_at,
      }
    : null

  return <AccountForm user={user} />
}