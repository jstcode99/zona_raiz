import { PropertyColumns, PropertyRow } from "@/features/properties/property-columns";
import PropertiesTable from "@/features/properties/property-table";
import Link from "next/link";
import { SupabasePropertyRepository } from "@/infrastructure/db/SupabasePropertyRepository";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";


export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: 'asc' | 'desc' }>
}) {
  const { search = '', sort = 'asc' } = await searchParams;
  const supabase = new SupabasePropertyRepository()
  const data = supabase.search(search, sort)

  return (
    <main className="flex items-center justify-between px-4 lg:px-6">
      <Suspense fallback={<Spinner />}>
        <PropertiesTable properties={data as Promise<PropertyRow[]>} columns={PropertyColumns} />
      </Suspense>
    </main>
  );
}
