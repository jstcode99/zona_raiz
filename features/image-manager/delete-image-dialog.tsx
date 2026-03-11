"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useTranslation } from "react-i18next"

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteImageDialog({ open, onClose, onConfirm }: Props) {
  const { t } = useTranslation('components')

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("components.property-images.delete-warning")}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex justify-end gap-2">
          <AlertDialogCancel>{t("words.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t("words.delete")}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}