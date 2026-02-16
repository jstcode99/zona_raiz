import { Spinner } from "@/components/ui/spinner";
import { RealEstateForm } from "@/features/real-states/real-state-form";
import { SupabaseRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository";
import { encodedRedirect } from "@/shared/redirect";
import { Suspense } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const supabase = new SupabaseRealEstateRepository()
  const data = await supabase.findById(id)

  if (!data) {
    return encodedRedirect('error', '/dashboard/real-state', 'No se pudo cargar el la inmobiliaria')
  }

  return (
    <main className="min-h-screen bg-muted/40 py-10 px-4">
      <Suspense fallback={<Spinner />}>
        <RealEstateForm id={id} defaultValues={data} />
      </Suspense>
    </main>
  );
}
