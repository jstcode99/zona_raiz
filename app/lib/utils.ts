import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
