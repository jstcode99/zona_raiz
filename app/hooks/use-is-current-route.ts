"use client"

import { usePathname } from "next/navigation"

export function useIsCurrentRoute() {
    const pathname = usePathname()
  
    const isCurrentRoute = (paths: string | string[]) => {
      const routes = Array.isArray(paths) ? paths : [paths]
      return routes.some((path) => pathname.startsWith(path))
    }
  
    return isCurrentRoute
  }