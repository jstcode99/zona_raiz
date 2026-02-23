import { ReactNode, Suspense } from "react"
import { PageLoader } from "@/features/loader/page-loader"
import { encodedRedirect } from "@/shared/redirect"
import { Metadata } from "next"
import { getCurrentUserCached } from "@/services/session.service"

export const metadata: Metadata = {
  title: "Configuración de cuenta",
  description: "Complete su configuración de cuenta",
}

export default async function PostLoginLayout({
  children,
}: {
  children: ReactNode
}) {

  const user = await getCurrentUserCached();

  if (!user) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
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
