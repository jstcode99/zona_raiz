import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { getUserById } from "@/services/user.services"
import { encodedRedirect } from "@/shared/redirect"
import { UserForm } from "@/features/user/user-form"
import { UserInput } from "@/application/validation/user.validation"

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let user: UserInput
  try {
    const data = await getUserById(id)
    user = {
      email: data.email,
      full_name: data.full_name,
      role: data.role,
    }
  } catch {
    return encodedRedirect("error", "/dashboard/users", "No se pudo cargar el usuario")
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

