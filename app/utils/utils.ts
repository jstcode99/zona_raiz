import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function optimizeImage(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file)

  const size = 256
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext("2d")!
  ctx.drawImage(imageBitmap, 0, 0, size, size)

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob(
      (b) => resolve(b!),
      "image/webp",
      0.85 // Adjust quality as needed
    )
  )

  return new File([blob], "avatar.webp", {
    type: "image/webp",
  })
}