"use client"

import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { IconDotsVertical } from "@tabler/icons-react"
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook"
import { assignInquiryAction, deleteInquiryAction, updateInquiryStatusAction } from "@/application/actions/inquiry.actions"
import { inquiryStatusLabels } from "@/domain/entities/inquiry.entity"

interface InquiryRowActionsProps {
  inquiryId: string
}

export function InquiryRowActions({ inquiryId }: InquiryRowActionsProps) {
  const { t } = useTranslation('common')

  const deleteMutation = useServerMutation({
    action: deleteInquiryAction as any,
    onSuccess: () => {
      toast.success(t("words.deleted") || "Eliminado")
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error")
    },
  })

  const statusMutation = useServerMutation({
    action: updateInquiryStatusAction as any,
    onSuccess: () => {
      toast.success(t("words.updated") || "Actualizado")
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error")
    },
  })

  const assignMutation = useServerMutation({
    action: assignInquiryAction as any,
    onSuccess: () => {
      toast.success(t("words.assigned") || "Asignado")
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error")
    },
  })

  const handleDelete = () => {
    const confirmed = typeof window !== "undefined"
      ? window.confirm(t("words.confirm") || "¿Confirmar?")
      : true
    if (!confirmed) return
    const data = new FormData()
    data.append("id", inquiryId)
    deleteMutation.action(data)
  }

  const handleStatusChange = (status: string) => {
    const data = new FormData()
    data.append("id", inquiryId)
    data.append("status", status)
    statusMutation.action(data)
  }

  const handleAssign = () => {
    const userId = window.prompt("Ingresa el ID del usuario para asignar:")
    if (!userId) return
    const data = new FormData()
    data.append("id", inquiryId)
    data.append("assigned_to", userId)
    assignMutation.action(data)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={deleteMutation.isPending || statusMutation.isPending || assignMutation.isPending}>
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(inquiryStatusLabels).map(([value, label]) => (
          <DropdownMenuItem key={value} onClick={() => handleStatusChange(value)}>
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAssign}>
          Asignar a usuario
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
