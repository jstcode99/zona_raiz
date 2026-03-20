"use client"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"

import { SortableImageItem } from "./sortable-image-item"
import { ImageProgress } from "./image-progress"
import { SortableImage } from "@/application/mappers/property-image.mapper"

interface Props {
  images: SortableImage[]
  onReorder: (images: SortableImage[]) => void
  onDelete: (id: string) => void
  onPrimary: (id: string) => void
  onMetaChange: (id: string, data: { alt_text?: string; caption?: string }) => void
  pending?: boolean
}

export function SortableImageGrid({
  images,
  onReorder,
  onDelete,
  onPrimary,
  onMetaChange,
  pending
}: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = images.findIndex(i => i.id === active.id)
    const newIndex = images.findIndex(i => i.id === over.id)

    onReorder(arrayMove(images, oldIndex, newIndex))
  }

  return (
    <div className="space-y-4">
      {pending && <ImageProgress value={70} />}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images} strategy={rectSortingStrategy}>
          <div className="grid md:grid-cols-3 gap-4">
            {images.map(img => (
              <SortableImageItem
                key={img.id}
                image={img}
                onDelete={() => onDelete(img.id)}
                onPrimary={() => onPrimary(img.id)}
                onMetaChange={data => onMetaChange(img.id, data)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}