import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import RealEstatesTable from "@/features/real-states/real-estate-table";
import { RealEstateColumns } from "@/features/real-states/real-estate-columns";
import { listRealEstates } from "@/services/real-estate.services";


export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: 'asc' | 'desc' }>
}) {
  const { search = '', sort = 'asc' } = await searchParams;
  const realEstates = listRealEstates()

  return (
    <main className="flex items-center justify-between px-4 lg:px-6">
      <Suspense fallback={<Spinner />}>
        <RealEstatesTable realEstates={realEstates} columns={RealEstateColumns} />
      </Suspense>
    </main>
  );
}
