
import { encodedRedirect } from "@/shared/redirect"
import AuthBackgroundShape from '@/assets/svg/background-shape'
import AccountSectionCard from "@/features/profile/profile-section-card"
import { getCurrentUser } from "@/services/session.services";

export default async function Account() {
  const profile = await getCurrentUser();

  if (!profile) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <AccountSectionCard defaultValues={profile} />
    </div>
  )
}
