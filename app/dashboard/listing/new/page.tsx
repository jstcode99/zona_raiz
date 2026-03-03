import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { ListingForm } from "@/features/listing/listing-form";

export default async function page() {
  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Suspense fallback={<Spinner />}>
        <Card className='w-full sm:max-w-4xl'>
          <CardContent>
            <ListingForm/>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
