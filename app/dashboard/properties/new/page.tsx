import { PropertyForm } from "@/features/properties/property-form";
import { COOKIE_NAMES } from "@/infrastructure/config/constants";
import { cookies } from "next/headers";
import AuthBackgroundShape from '@/assets/svg/background-shape'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import i18next from "i18next";

export default async function page() {
  const cookieStore = await cookies()
  const realEstateId = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  return (
    <div className='relative flex h-auto items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape width='1500' height='900' />
      </div>
      <Suspense fallback={<Spinner />}>
        <Card className='z-1 w-full border-none sm:max-w-2xl'>
          <CardHeader className='gap-2'>
            <CardTitle className='text-xl'>{i18next.t('forms.property.title')}</CardTitle>
            <CardDescription className='text-base'>
              {i18next.t('forms.property.subtitle')}
            </CardDescription>
          </CardHeader>
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
