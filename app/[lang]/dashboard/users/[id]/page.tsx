import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { encodedRedirect } from "@/shared/redirect"
import { UserForm } from "@/features/users/user-form"
import { UserInput } from "@/application/validation/user.validation"
import { Lang } from "@/i18n/settings"
import { initI18n } from "@/i18n/server"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { appModule } from "@/application/modules/app.module"

interface props {
  params: Promise<{ lang: Lang, id: string }>
}

export default async function page({ params }: props) {
  const { lang, id } = await params;
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { userService } = await appModule(lang, { cookies: cookieStore })

  let user: UserInput

  try {
    const data = await userService.getCachedUserById(id)

    if (!data || !id || data === null) {
      return encodedRedirect('error', routes.users(), t("common:exceptions.data_not_found"))
    }

    user = {
      email: data.email,
      full_name: data.full_name,
      role: data.role,
    }
  } catch {
    return encodedRedirect('error', routes.users(), t("common:exceptions.data_not_found"))
  }

  return (
    <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<Spinner />}>
        <Card className="w-full border-none sm:max-w-3xl">
          <CardContent>
            <UserForm id={id} defaultValues={user} />
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}

