import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AuthShape } from "@/assets/svg/auth-shape";
import { PageTransition } from "@/components/ui/page-transtion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-8 bg-muted/30">
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div
        className="w-full max-w-sm md:max-w-4xl relative"
        style={{ animation: "authFadeIn 0.5s ease both" }}
      >
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden p-0 shadow-xl">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Form side */}
              <div style={{ animation: "authSlideRight 0.5s ease 0.1s both" }}>
                <PageTransition>{children}</PageTransition>
              </div>

              {/* Image side */}
              <div
                className="relative hidden md:block"
                style={{ animation: "authSlideLeft 0.5s ease 0.15s both" }}
              >
                <AuthShape className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] dark:grayscale" />
                {/* Overlay decorativo */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes authSlideRight {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes authSlideLeft {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </div>
  );
}
