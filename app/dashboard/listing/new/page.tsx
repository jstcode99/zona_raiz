import { PropertyForm } from "@/features/properties/property-form";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { cookies } from "next/headers";
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function page() {
  const cookieStore = await cookies()
  const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full sm:max-w-3xl'>
          <CardContent>
            <PropertyForm
              realEstateId={realEstateId}
            />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
