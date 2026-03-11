import { encodedRedirect } from "@/shared/redirect"
import AuthBackgroundShape from '@/assets/svg/background-shape'
import AccountSectionCard from "@/features/profile/profile-section-card"
import { sessionModule } from "@/application/modules/session.module";

export default async function page() {
  const { sessionService } = await sessionModule()
  const profile = await sessionService.getCachedCurrentUser();

  if (!profile) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  return (
    <div className='relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <AccountSectionCard defaultValues={profile} />
    </div>
  )
}
