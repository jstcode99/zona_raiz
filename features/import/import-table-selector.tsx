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

interface ImportTableSelectorProps {
  value: ImportTableName;
  onChange: (value: ImportTableName) => void;
  disabled?: boolean;
}

export function ImportTableSelector({
  value,
  onChange,
  disabled = false,
}: ImportTableSelectorProps) {
  const { t } = useTranslation("import");

  return (
    <div className="space-y-2">
      <Label htmlFor="table-selector">{t("fields.table")}</Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as ImportTableName)}
        disabled={disabled}
      >
        <SelectTrigger id="table-selector" className="w-full">
          <SelectValue placeholder={t("placeholders.select-table")} />
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
      <p className="text-xs text-muted-foreground">{t("descriptions.table-help")}</p>
    </div>
  );
}
