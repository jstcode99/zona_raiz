// app/[lang]/dashboard/import/import-page-client.tsx

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ImportDialog } from "@/features/import/import-dialog";
import { ImportProgress } from "@/features/import/import-progress";
import { ImportJobEntity, ImportJobStatus, ImportTableName } from "@/domain/entities/import-job.entity";
import { Download, Plus } from "lucide-react";
import { getImportJobsAction } from "@/application/actions/import";

interface ImportPageClientProps {
  lang: string;
}

export function ImportPageClient({ lang }: ImportPageClientProps) {
  const { t } = useTranslation("import");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ImportJobEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar jobs al montar
  useEffect(() => {
    const loadJobs = async () => {
      const result = await getImportJobsAction();
      if (result.success && result.data) {
        setJobs(result.data as ImportJobEntity[]);
      }
      setIsLoading(false);
    };
    loadJobs();
  }, []);

  const getStatusBadgeVariant = (status: ImportJobStatus) => {
    switch (status) {
      case ImportJobStatus.PENDING:
        return "secondary";
      case ImportJobStatus.PROCESSING:
        return "default";
      case ImportJobStatus.COMPLETED:
        return "default";
      case ImportJobStatus.FAILED:
        return "destructive";
      case ImportJobStatus.CANCELLED:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTableLabel = (tableName: ImportTableName) => {
    switch (tableName) {
      case ImportTableName.PROPERTIES:
        return t("tables.properties");
      case ImportTableName.LISTINGS:
        return t("tables.listings");
      case ImportTableName.REAL_ESTATES:
        return t("tables.real-estates");
      default:
        return tableName;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
            <ImportProgress
              jobId={selectedJobId}
              onComplete={() => {
                setSelectedJobId(null);
                // Recargar jobs
                getImportJobsAction().then((result) => {
                  if (result.success && result.data) {
                    setJobs(result.data as ImportJobEntity[]);
                  }
                });
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Historial de imports */}
      <Card>
        <CardHeader>
          <CardTitle>{t("labels.history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fields.filename")}</TableHead>
                <TableHead>{t("fields.table")}</TableHead>
                <TableHead>{t("fields.status")}</TableHead>
                <TableHead>{t("fields.progress")}</TableHead>
                <TableHead>{t("fields.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t("messages.loading")}
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t("messages.no-imports")}
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      {job.originalFilename || t("labels.unnamed")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTableLabel(job.tableName)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {t(`status.${job.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.status === ImportJobStatus.PROCESSING ? (
                        <span className="text-primary">
                          {job.processedRows}/{job.totalRows}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {job.resultSummary
                            ? `${job.resultSummary.importedRows}/${job.resultSummary.totalRows}`
                            : "-"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(job.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de importación */}
      <ImportDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
