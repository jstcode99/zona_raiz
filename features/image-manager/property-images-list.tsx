"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { SortableImageGrid } from "./sortable-image-grid"
import { DeleteImageDialog } from "./delete-image-dialog"
import {
  deletePropertyImageFormAction,
  updatePropertyImageFormAction,
  reorderPropertyImagesFormAction,
  setPropertyImagePrimaryFormAction,
} from "@/application/actions/property-image.action"
import { useTranslation } from "react-i18next"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { PropertyImageEntity } from "@/domain/entities/property-image.entity"
import { SortableImage, toSortableImages } from "@/application/mappers/property-image.mapper"

interface Props {
  initialImages: PropertyImageEntity[]
  propertyId: string
}

export function PropertyImageList({
  initialImages,
  propertyId,
}: Props) {
  const [images, setImages] = useState<SortableImage[]>(() => toSortableImages(initialImages))
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { t } = useTranslation("images")

  // Action para reordenar imágenes (batch update)
  const { action: reorderAction, isPending: isReordering } = useServerMutation({
    action: reorderPropertyImagesFormAction,
    onSuccess: () => {
      toast.success(t("messages.order_updated"))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Action para actualizar imagen primaria
  const { action: setPrimaryAction, isPending: isSettingPrimary } = useServerMutation({
    action: setPropertyImagePrimaryFormAction,
    onSuccess: () => {
      toast.success(t("messages.primary_updated"))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Action para actualizar metadatos (alt_text, caption)
  const { action: updateMetaAction, isPending: isUpdatingMeta } = useServerMutation({
    action: updatePropertyImageFormAction,
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Action para eliminar imagen
  const { action: deleteImageAction, isPending: isDeleting } = useServerMutation({
    action: deletePropertyImageFormAction,
    onSuccess: () => {
      if (deleteId) {
        setImages(prev => prev.filter(img => img.id !== undefined && img.id !== deleteId))
      }
      setDeleteId(null)
      toast.success(t("messages.deleted"))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isPending = isReordering || isSettingPrimary || isUpdatingMeta || isDeleting

  // Reordenar imágenes usando batch action
  const handleReorder = useCallback((newImages: SortableImage[]) => {
    setImages(newImages)

    // Actualizar estado UI inmediatamente (optimistic update)
    // La acción batch actualiza el servidor
    const updates = newImages.map((img, index) => ({
      id: img.id,
      display_order: index,
    }))

    const fd = new FormData()
    fd.append("updates", JSON.stringify(updates))
    fd.append("propertyId", propertyId)
    reorderAction(fd)
  }, [propertyId, reorderAction])

  // Establecer imagen como primaria usando batch action
  const handleSetPrimary = useCallback((id: string) => {
    const updated = images.map(img => ({
      ...img,
      is_primary: img.id === id,
    }))

    // Actualizar estado UI inmediatamente (optimistic update)
    setImages(updated)

    // Llamar a la acción batch
    const fd = new FormData()
    fd.append("propertyId", propertyId)
    fd.append("imageId", id)
    setPrimaryAction(fd)
  }, [images, propertyId, setPrimaryAction])

  // Actualizar metadatos
  const handleMetaChange = useCallback((id: string, data: { alt_text?: string; caption?: string }) => {
    // Actualizar estado UI
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, ...data } : img))
    )

    // Enviar al servidor
    const fd = new FormData()
    fd.append("id", id)
    if (data.alt_text !== undefined) fd.append("alt_text", data.alt_text)
    if (data.caption !== undefined) fd.append("caption", data.caption)
    updateMetaAction(fd)
  }, [updateMetaAction])

  // Confirmar eliminación
  const handleConfirmDelete = useCallback(() => {
    if (!deleteId) return
    const fd = new FormData()
    fd.append("id", deleteId)
    deleteImageAction(fd)
  }, [deleteId, deleteImageAction])

  return (
    <>
      <SortableImageGrid
        images={images}
        onReorder={handleReorder}
        onDelete={setDeleteId}
        onPrimary={handleSetPrimary}
        onMetaChange={handleMetaChange}
        pending={isPending}
      />

      <DeleteImageDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
