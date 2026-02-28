"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ImagePreviewCard } from "./image-preview-card"
import { ImageInlineEditor } from "./image-inline-editor"
import { GripVertical } from "lucide-react"
import { PropertyImageEntity } from "@/domain/entities/property-image.entity"

export function SortableImageItem({
  image,
  onDelete,
  onPrimary,
  onMetaChange
}: {
  image: PropertyImageEntity
  onDelete: () => void
  onPrimary: () => void
  onMetaChange: (data: { alt_text?: string; caption?: string }) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id as string})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className="border rounded-xl">
      <div className="relative">
        <div
          className="absolute top-2 left-2 z-10 cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical />
        </div>

        <ImagePreviewCard
          imageUrl={image.public_url as string}
          isPrimary={image.is_primary}
          onDelete={onDelete}
          onPrimary={onPrimary}
        />
      </div>

      <ImageInlineEditor
        alt={image.alt_text}
        caption={image.caption}
        onChange={onMetaChange}
      />
    </div>
  )
}