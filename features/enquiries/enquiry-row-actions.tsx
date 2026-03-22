"use client";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconUserPlus } from "@tabler/icons-react";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import {
  deleteEnquiryAction,
  updateEnquiryStatusAction,
} from "@/application/actions/enquiry.actions";
import { enquiryStatusLabels } from "@/domain/entities/enquiry.entity";
import { AgentSelectorClient } from "./agent-selector-client";

interface EnquiryRowActionsProps {
  inquiryId: string;
  realEstateId: string;
}

export function EnquiryRowActions({
  inquiryId,
  realEstateId,
}: EnquiryRowActionsProps) {
  const { t } = useTranslation("enquiries");

  const deleteMutation = useServerMutation({
    action: deleteEnquiryAction,
    onSuccess: () => {
      toast.success(t("words.deleted") || "Eliminado");
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error");
    },
  });

  const statusMutation = useServerMutation({
    action: updateEnquiryStatusAction,
    onSuccess: () => {
      toast.success(t("words.updated") || "Actualizado");
    },
    onError: (error) => {
      toast.error(error.message || (t("words.error") as string) || "Error");
    },
  });

  const handleDelete = () => {
    const confirmed =
      typeof window !== "undefined"
        ? window.confirm(t("words.confirm") || "¿Confirmar?")
        : true;
    if (!confirmed) return;
    const data = new FormData();
    data.append("id", inquiryId);
    deleteMutation.action(data);
  };

  const handleStatusChange = (status: string) => {
    const data = new FormData();
    data.append("id", inquiryId);
    data.append("status", status);
    statusMutation.action(data);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={deleteMutation.isPending || statusMutation.isPending}
        >
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {Object.entries(enquiryStatusLabels).map(([value, label]) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleStatusChange(value)}
          >
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <AgentSelectorClient inquiryId={inquiryId} realEstateId={realEstateId}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <IconUserPlus className="mr-2 h-4 w-4" />
            {t("actions.assign")}
          </DropdownMenuItem>
        </AgentSelectorClient>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          {t("words:delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
