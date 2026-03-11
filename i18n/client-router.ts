"use client"

import { useParams } from "next/navigation"
import { createRouter } from "./router"

export function useRoutes() {

  const { lang } = useParams()

  return createRouter(lang as "es" | "en")
}