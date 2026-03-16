import { Suspense } from "react"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import UsersTable from "@/features/users/user-table"
import { UserColumns } from "@/features/users/user-columns"
import { cookies } from "next/headers"
import { createRouter } from "@/i18n/router"
import { Lang } from "@/i18n/settings"
import { appModule } from "@/application/modules/app.module"

interface props {
  params: Promise<{ lang: Lang }>
}

export default async function page({ params }: props) {
  const { lang } = await params;
  const cookieStore = await cookies()
  const routes = createRouter(lang)
  const { userService } = await appModule(lang, { cookies: cookieStore })
  const users = userService.getCachedListUsers()

  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-end">
            <Button asChild>
              <Link href={`${routes.users()}/new`}>
                <IconPlus />
              </Link>
            </Button>
          </div>

          <Suspense fallback={<Spinner />}>
            <UsersTable users={users} columns={UserColumns} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}

