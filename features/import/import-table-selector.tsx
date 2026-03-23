// features/import/import-table-selector.tsx

"use client";

import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImportTableName } from "@/domain/entities/import-job.entity";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface ImportTableSelectorProps {
  detectedTable: ImportTableName | null
  confidence: number
  onSelect: (table: ImportTableName) => void
}

export function ImportTableSelector({
  detectedTable,
  confidence,
  onSelect,
}: ImportTableSelectorProps) {
  const { t } = useTranslation("import");

  const confidencePercent = Math.round(confidence * 100);
  const tableOptions = [
    { value: ImportTableName.PROPERTIES, label: t("tables.properties") },
    { value: ImportTableName.LISTINGS, label: t("tables.listings") },
    { value: ImportTableName.REAL_ESTATES, label: t("tables.real-estates") },
  ];

  return (
    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <Label className="text-sm font-medium">
          {t("detection.confidence_low")}
        </Label>
      </div>
      
      {detectedTable && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {t("detection.detected_table")}: {t(`tables.${detectedTable}`)}
          </span>
          <span>
            {t("detection.confidence")}: {confidencePercent}%
          </span>
        </div>
      )}
      
      <Select
        onValueChange={(val) => onSelect(val as ImportTableName)}
      >
        <SelectTrigger id="table-selector" className="w-full">
          <SelectValue placeholder={t("placeholders.select-table")} />
        </SelectTrigger>
        <SelectContent>
          {tableOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
