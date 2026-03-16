import { encodedRedirect } from "@/shared/redirect"
import AuthBackgroundShape from '@/assets/svg/background-shape'
import AccountSectionCard from "@/features/profile/profile-section-card"
import { Lang } from "@/i18n/settings";
import { initI18n } from "@/i18n/server";
import { cookies } from "next/headers";
import { createRouter } from "@/i18n/router";
import { appModule } from "@/application/modules/app.module";

interface props {
  params: Promise<{ lang: Lang }>
}

export default async function page({ params }: props) {
  const { lang } = await params;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { sessionService } = await appModule(lang, { cookies: cookieStore })
  const profile = await sessionService.getCachedCurrentUser();

  if (!profile) {
    encodedRedirect('error', routes.signin(), t("exceptions:data_not_found"))
  }

  return (
    <div className='relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <AccountSectionCard defaultValues={profile} />
    </div>
  )
}
