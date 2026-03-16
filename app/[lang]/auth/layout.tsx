import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{ backgroundImage: `url('/images/texture.png')` }}
      className="bg-cover bg-center flex min-h-svh flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              {children}
              <div className="bg-muted relative hidden md:block">
                <Image
                  src="/images/auth.jpg"
                  width={800}
                  height={100}
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
        </div >
      </div>
    </div>
  )
}