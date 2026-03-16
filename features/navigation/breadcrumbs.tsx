"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

export function Breadcrumbs() {
  const pathname = usePathname()

  const segments = pathname.split("/").filter(Boolean)

  const lang = segments[0]

  // quitamos idioma
  const routeSegments = segments.slice(1)

  const breadcrumbs = routeSegments.map((segment, index) => {
    const href =
      "/" +
      lang +
      "/" +
      routeSegments.slice(0, index + 1).join("/")

    const label = segment
      .replaceAll("-", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())

    return { href, label }
  })

  if (!breadcrumbs.length) return null

  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <Fragment key={crumb.href}>
          {index > 0 && <span className="mx-2">/</span>}

          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}