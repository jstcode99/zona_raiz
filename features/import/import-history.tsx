// features/import/import-history.tsx

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ImportJobEntity,
  ImportJobStatus,
  ImportTableName,
} from "@/domain/entities/import-job.entity";
import { getImportJobsAction } from "@/application/actions/import";

interface ImportHistoryProps {
  lang: string;
}

export function ImportHistory({ lang }: ImportHistoryProps) {
  const { t } = useTranslation("import");
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
    return new Date(dateString).toLocaleDateString(
      lang === "es" ? "es-CO" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  return (
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
            <TableCell
              colSpan={5}
              className="text-center py-8 text-muted-foreground"
            >
              {t("messages.loading")}
            </TableCell>
          </TableRow>
        ) : jobs.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-8 text-muted-foreground"
            >
              {t("messages.no-imports")}
            </TableCell>
          </TableRow>
        ) : (
          jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                {t("labels.import")} #{job.id.slice(0, 8)}
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
                  <div className="space-y-1">
                    <Progress
                      value={(job.processedRows / job.totalRows) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {job.processedRows}/{job.totalRows}
                    </p>
                  </div>
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
  );
}
