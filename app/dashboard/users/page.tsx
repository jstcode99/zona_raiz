import { Suspense } from "react"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"
import { ROUTES } from "@/infrastructure/config/constants"
import { listUsers } from "@/services/user.services"
import UsersTable from "@/features/user/user-table"
import { UserColumns, UserRow } from "@/features/user/user-colums"

async function UsersTableSection() {
  const users = listUsers()
  const rows = users.then((items) => items as unknown as UserRow[])

  return <UsersTable users={rows} columns={UserColumns} />
}

export default async function page() {
  return (
    <main className="flex-col items-center justify-center space-y-4 px-4 lg:px-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-end">
            <Button asChild>
              <Link href={`${ROUTES.DASHBOARD}${ROUTES.USERS}/new`}>
                <IconPlus />
              </Link>
            </Button>
          </div>

          <Suspense fallback={<Spinner />}>
            <UsersTableSection />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}

