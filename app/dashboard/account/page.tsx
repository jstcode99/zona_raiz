
import { encodedRedirect } from "@/shared/redirect"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"
import AuthBackgroundShape from '@/assets/svg/background-shape'
import AccountSectionCard from "@/features/profile/profile-section-card"

export default async function Account() {
  const supabase = new SupabaseProfileRepository()
  const data = await supabase.getCurrentProfile()

  if (!data || !data.profile) {
    return encodedRedirect('error', '/dashboard/account', 'No se pudo cargar el perfil')
  }

  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <AccountSectionCard defaultValues={data} />
    </div>
  )
}
