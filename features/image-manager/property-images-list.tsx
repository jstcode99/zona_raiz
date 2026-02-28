"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { SortableImageGrid } from "./sortable-image-grid"
import { DeleteImageDialog } from "./delete-image-dialog"
import { deletePropertyImageAction, updatePropertyImageAction } from "@/application/actions/property-image.action"

interface Props {
  initialImages: any[]
}

export function PropertyImageList({
  initialImages
}: Props) {
  console.log(initialImages);

  const [images, setImages] = useState(initialImages)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function reorderImages(newImages: any[]) {
    setImages(newImages)

    startTransition(async () => {
      await Promise.all(
        newImages.map((img, index) =>
          updatePropertyImageAction(img.id, createFormData({
            display_order: index
          }))
        )
      )

      toast.success("Orden actualizado")
    })
  }

  function setPrimary(id: string) {
    const updated = images.map(img => ({
      ...img,
      is_primary: img.id === id
    }))

    setImages(updated)

    startTransition(async () => {
      await Promise.all(
        updated.map(img =>
          updatePropertyImageAction(
            img.id,
            createFormData({
              is_primary: img.is_primary
            })
          )
        )
      )

      toast.success("Imagen principal actualizada")
    })
  }

  function updateMeta(id: string, data: any) {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...data } : img))
    )

    startTransition(async () => {
      await updatePropertyImageAction(id, createFormData(data))
    })
  }

  function confirmDelete() {
    if (!deleteId) return

    startTransition(async () => {
      await deletePropertyImageAction(deleteId)
      setImages(prev => prev.filter(img => img.id !== deleteId))
      setDeleteId(null)
      toast.success("Imagen eliminada")
    })
  }

  return (
    <>
      <SortableImageGrid
        images={images}
        onReorder={reorderImages}
        onDelete={setDeleteId}
        onPrimary={setPrimary}
        onMetaChange={updateMeta}
        pending={pending}
      />

      <DeleteImageDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function createFormData(data: Record<string, any>) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)))
  return fd
}