import { Spinner } from "@/components/ui/spinner";
import { PropertyForm } from "@/features/properties/property-form";
import { SupabasePropertyRepository } from "@/infrastructure/db/SupabasePropertyRepository";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const supabase = new SupabasePropertyRepository()
  const data = await supabase.findById(id)

  if (!data) {
    return encodedRedirect('error', '/dashboard/account', 'No se pudo cargar el perfil')
  }

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <Suspense fallback={<Spinner />}>
        <PropertyForm id={id} defaultValues={data} />
      </Suspense>
    </main>
  );
}
