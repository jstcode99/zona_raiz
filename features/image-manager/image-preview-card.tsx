"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Trash2 } from "lucide-react"

interface Props {
  imageUrl: string
  isPrimary?: boolean
  onDelete: () => void
  onPrimary: () => void
}

export function ImagePreviewCard({
  imageUrl,
  isPrimary,
  onDelete,
  onPrimary
}: Props) {
  
  return (
    <div className="relative border rounded-xl overflow-hidden">
      <Image
        src={imageUrl}
        alt="preview"
        width={400}
        height={300}
        className="object-cover w-full h-48"
        unoptimized
      />

      <div className="absolute top-2 right-2 flex gap-2">
        <Button size="icon" variant="secondary" onClick={onPrimary}>
          <Star className={isPrimary ? "fill-yellow-400" : ""} />
        </Button>

        <Button size="icon" variant="destructive" onClick={onDelete}>
          <Trash2 />
        </Button>
      </div>
    </div>
  )
}