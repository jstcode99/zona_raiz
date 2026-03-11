import { Card, CardContent } from '@/components/ui/card'
import { RealEstateForm } from "@/features/real-states/real-estate-form";

export default async function page() {

  return (
    <div className='flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <Card className='w-full sm:max-w-3xl'>
        <CardContent>
          <RealEstateForm />
        </CardContent>
      </Card>
    </div>
  );
}
