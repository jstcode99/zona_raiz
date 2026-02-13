import { AvatarUpload } from "@/features/account/avatar-upload"
import { AccountForm } from "@/features/account/account-form"
import { encodedRedirect } from "@/shared/redirect"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"

export default async function Account() {

  const supabase = new SupabaseProfileRepository()
  const data = await supabase.getCurrentProfile()

  if (!data || !data.profile) {
    return encodedRedirect('error', '/dashboard/account', 'No se pudo cargar el perfil')
  }

  return (
    <main className="min-h-screen flex-col items-center justify-center bg-muted/40 py-10 px-4">
      <div className="px-6 max-w-4xl mx-auto flex items-center relative">
        <AvatarUpload
          avatarUrl={data?.profile.avatar_url || ''}
          name={data?.profile.name || ''}
        />
      </div>
      <AccountForm defaultValues={{
        name: data?.profile.name || '',
        last_name: data?.profile.last_name || '',
        phone: data?.profile.phone || '',
      }} />
    </main>

  )
}
