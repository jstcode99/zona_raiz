import {  ReactNode, Suspense } from "react"
import { PageLoader } from "@/features/loader/page-loader"
import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"
import { encodedRedirect } from "@/shared/redirect"

export default async function PostLoginLayout({
  children,
}: {
  children: ReactNode
}) {

  const supabase = new SupabaseProfileRepository()
  const profile = await supabase.getCurrentProfile()

  if (!profile || !profile.profile) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
      <div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </div>
      <div className='relative max-h-screen w-full p-2 max-lg:hidden'>
        <div className='h-full w-full rounded-2xl bg-black'></div>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png'
          alt='404 illustration'
          className='absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2'
        />
      </div>
    </div>
  )
}
