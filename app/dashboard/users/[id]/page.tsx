import { Spinner } from "@/components/ui/spinner";
import { UserProfileAdminForm } from "@/features/users/user-form";
import { SupabaseUserRepository } from "@/infrastructure/db/SupabaseUserRepository";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const supabase = new SupabaseUserRepository()
  const data = await supabase.findById(id)

  if (!data || !data.profile) {
    return encodedRedirect('error', '/dashboard/account', 'No se pudo cargar el perfil')
  }

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <Suspense fallback={<Spinner />}>
        <UserProfileAdminForm userId={id} defaultValues={{
          name: data.profile?.name,
          last_name: data.profile?.last_name as string,
          phone: data.profile?.phone as string,
        }} />
      </Suspense>
    </main>
  );
}
