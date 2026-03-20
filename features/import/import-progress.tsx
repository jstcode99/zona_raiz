// features/import/import-progress.tsx

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImportJobEntity, ImportJobStatus } from "@/domain/entities/import-job.entity";
import { getImportJobByIdAction } from "@/application/actions/import";
import { AlertCircle, CheckCircle, XCircle, Loader2, Clock, AlertTriangle } from "lucide-react";

interface ImportProgressProps {
  jobId: string | null;
  onComplete?: (job: ImportJobEntity) => void;
  onCancel?: () => void;
}

export function ImportProgress({ jobId, onComplete, onCancel }: ImportProgressProps) {
  const { t } = useTranslation("import");
  const [job, setJob] = useState<ImportJobEntity | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      const result = await getImportJobByIdAction(jobId);
      if (result.success && result.data) {
        setJob(result.data as ImportJobEntity);
        if (
          result.data.status === ImportJobStatus.COMPLETED ||
          result.data.status === ImportJobStatus.FAILED ||
          result.data.status === ImportJobStatus.CANCELLED
        ) {
          onComplete?.(result.data as ImportJobEntity);
        }
      }
    };

    // Initial fetch
    fetchJob();

    // Poll every 2 seconds if processing
    const interval = setInterval(() => {
      if (job?.status === ImportJobStatus.PROCESSING) {
        fetchJob();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status, onComplete]);

  if (!job) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const progress = job.totalRows > 0 ? (job.processedRows / job.totalRows) * 100 : 0;

  const getStatusIcon = () => {
    switch (job.status) {
      case ImportJobStatus.PENDING:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case ImportJobStatus.PROCESSING:
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case ImportJobStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case ImportJobStatus.FAILED:
        return <XCircle className="h-5 w-5 text-destructive" />;
      case ImportJobStatus.CANCELLED:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge variant={getStatusBadgeVariant(job.status)}>
            {t(`status.${job.status}`)}
          </Badge>
        </div>
        {job.errors.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {job.errors.length} {t("labels.errors")}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            {job.processedRows} / {job.totalRows} {t("labels.rows")}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {job.resultSummary && (
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-3 text-sm">
          <div>
            <span className="text-muted-foreground">{t("labels.total")}:</span>
            <span className="ml-1 font-medium">{job.resultSummary.totalRows}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t("labels.imported")}:</span>
            <span className="ml-1 font-medium text-green-600">
              {job.resultSummary.importedRows}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">{t("labels.failed")}:</span>
            <span className="ml-1 font-medium text-destructive">
              {job.resultSummary.failedRows}
            </span>
          </div>
        </div>
      )}

      {job.errors.length > 0 && job.errors.length <= 5 && (
        <div className="space-y-1">
          <p className="text-sm font-medium">{t("labels.recent-errors")}:</p>
          {job.errors.slice(0, 5).map((err, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-destructive">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              <span>
                {t("labels.row")} {err.row}, {err.column}: {err.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {job.status === ImportJobStatus.PROCESSING && onCancel && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {t("actions.cancel")}
          </Button>
        </div>
      )}
    </div>
  );
}
