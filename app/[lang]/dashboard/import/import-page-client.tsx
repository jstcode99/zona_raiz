// app/[lang]/dashboard/import/import-page-client.tsx

"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportDialog } from "@/features/import/import-dialog";
import { ImportProgress } from "@/features/import/import-progress";
import { ImportHistory } from "@/features/import/import-history";
import { ImportJobEntity } from "@/domain/entities/import-job.entity";
import { Download, Plus } from "lucide-react";
import { getImportJobsAction } from "@/application/actions/import";

interface ImportPageClientProps {
  lang: string;
}

export function ImportPageClient({ lang }: ImportPageClientProps) {
  const { t } = useTranslation("import");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const handleImportComplete = async () => {
    setSelectedJobId(null);
    // Trigger re-render of ImportHistory by calling the action
    await getImportJobsAction();
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("actions.download-template")}
          </Button>
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
