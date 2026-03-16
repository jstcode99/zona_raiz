import { DEFAULT_LANG, Lang } from "@/i18n/settings";
import { clsx, type ClassValue } from "clsx"
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiales
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .substring(0, 50);
}
export const formatCurrency = (value?: number | string) => {
  if (value === undefined || value === null || value === "") return ""

  const number = typeof value === "string" ? Number(value) : value

  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
  }).format(number)
}

export const parseCurrency = (value: string) => {
  return value.replace(/[^\d]/g, "")
}

export const isEmpty = (v: unknown) =>
  !v || v === undefined || v === null || v === "" || Number.isNaN(v)

export const toNumber = (v: string | null) => {
  if (!v) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export function removeNullish<T extends Record<string, any>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => isEmpty(value))
  ) as Partial<T>
}

export const clearPathFiles = (url: string) => {
  let clearUrl = url.split("?")[0]
  clearUrl = clearUrl.split("/").slice(-2).join("/")
  return clearUrl
}

export function pickDefined<T extends object>(obj: T): {
  [K in keyof T as T[K] extends null | undefined ? never : K]: Exclude<T[K], null | undefined>
} {
  const result: any = {}
  for (const key in obj) {
    const value = obj[key]
    if (value !== null && value !== undefined) {
      result[key] = value
    }
  }
  return result
}

export const objectToSearchParams = (obj: Record<string, unknown>) => {
  const params = new URLSearchParams()

  Object.entries(obj)
    .filter(([, v]) => !isEmpty(v))
    .forEach(([k, v]) => params.set(k, String(v)))
  return params
}


export const flatten = (obj: any, prefix = '', formData: FormData) => {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value instanceof File) {
      formData.append(fullKey, value)
    } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      formData.append(fullKey, JSON.stringify(value))
    } else if (value !== undefined && value !== null) {
      formData.append(fullKey, String(value))
    }
  })
  return formData
}

export const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price)

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const optimizeImage = (file: File, maxWidth = 512): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = () => {
      img.src = reader.result as string
    }

    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, 1)
      const canvas = document.createElement("canvas")

      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return
          resolve(
            new File([blob], file.name, {
              type: "image/webp",
              lastModified: Date.now(),
            })
          )
        },
        "image/webp",
        0.8
      )
    }

    reader.readAsDataURL(file)
  })
}


export function getClientLang(): Lang {

  const cookieLang = document.cookie
    .split("; ")
    .find((row) => row.startsWith("lang="))
    ?.split("=")[1] as Lang

  if (cookieLang === "es" || cookieLang === "en") return cookieLang

  if (navigator.language.startsWith("es")) return "es"

  return "en"
}

export function setClientLang(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`
}

export function getServerLang(request: NextRequest): Lang {

  const pathname = request.nextUrl.pathname
  const urlLang = pathname.split("/")[1] as Lang

  if (urlLang === "es" || urlLang === "en") return urlLang

  const cookieLang = request.cookies.get("lang")?.value as Lang
  if (cookieLang === "es" || cookieLang === "en") return cookieLang

  const headerLang = request.headers.get("accept-language")

  if (headerLang?.startsWith("es")) return "es"

  return DEFAULT_LANG
}
