"use client";
import { useParams } from "next/navigation";
import { createRouter, buildSearchUrl } from "./router";
export { buildSearchUrl };
export function useRoutes() {
  const { lang } = useParams();
  return createRouter(lang as "es" | "en");
}
