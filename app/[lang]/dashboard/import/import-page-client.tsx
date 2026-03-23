// app/[lang]/dashboard/import/import-page-client.tsx

"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImportDialog } from "@/features/import/import-dialog";
import { ImportProgress } from "@/features/import/import-progress";
import { ImportHistory } from "@/features/import/import-history";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { downloadTemplateAction, DownloadTemplateResult } from "@/application/actions/import";
import { getImportJobsAction } from "@/application/actions/import";
import { Plus } from "lucide-react";

interface ImportPageClientProps {
  lang: string;
}

export function ImportPageClient({ lang }: ImportPageClientProps) {
  const { t } = useTranslation("import");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const { action: downloadTemplate } = useServerMutation<DownloadTemplateResult>({
    action: downloadTemplateAction,
    onSuccess: (result) => {
      if (result.success && result.data) {
        const { content, filename, mimeType } = result.data;

        // Crear Blob en el cliente (navegador)
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        // Crear enlace y descargar
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    },
    onError: (error) => {
      toast.error(error.message || t("exceptions.download-failed"));
    },
  });

  const handleImportComplete = async () => {
    setSelectedJobId(null);
    // Trigger re-render of ImportHistory by calling the action
    await getImportJobsAction();
  };

  const handleDownloadTemplate = (tableName: string) => {
    const formData = new FormData();
    formData.append("tableName", tableName);
    downloadTemplate(formData);
  };

  return (
    <div className="space-y-6">
      {/* Acciones */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("actions.new-import")}
          </Button>

          <Select onValueChange={handleDownloadTemplate}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("actions.download-template")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ImportTableName.PROPERTIES}>
                {t("tables.properties")}
              </SelectItem>
              <SelectItem value={ImportTableName.LISTINGS}>
                {t("tables.listings")}
              </SelectItem>
              <SelectItem value={ImportTableName.REAL_ESTATES}>
                {t("tables.real-estates")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Progreso del job seleccionado */}
      {selectedJobId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("labels.current-job")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ImportProgress jobId={selectedJobId} onComplete={handleImportComplete} />
          </CardContent>
        </Card>
      )}

      {/* Historial de imports */}
      <Card>
        <CardHeader>
          <CardTitle>{t("labels.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ImportHistory lang={lang} />
        </CardContent>
      </Card>

      {/* Dialog de importación */}
      <ImportDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}