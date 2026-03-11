import { ROUTES } from "@/infrastructure/config/routes"

export function switchLang(
  pathname: string,
  from: "es" | "en",
  to: "es" | "en"
) {

  const clean = pathname.replace(/^\/(es|en)/, "")

  for (const route of Object.values(ROUTES)) {

    const source = route[from]
    const target = route[to]

    const regex = new RegExp(
      "^" + source.replace(/:[^/]+/g, "([^/]+)").replace(/\//g, "\\/") + "$"
    )

    const match = clean.match(regex)

    if (!match) continue

    let translated = target

    const params = source.match(/:[^/]+/g)

    if (params) {
      params.forEach((param, i) => {
        translated = translated.replace(param, match[i + 1])
      })
    }

    return `/${to}${translated}`
  }

  return `/${to}${clean}`
}