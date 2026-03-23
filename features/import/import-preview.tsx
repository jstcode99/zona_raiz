"use client";

import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { AlertTriangle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ImportData, ImportRow, ImportError } from "./import.types";

// Tipo para las filas de la tabla de preview
type TableRow = { id: string; hasError?: boolean } & Record<
  string,
  string | number | boolean | null | undefined
>;

interface ImportPreviewProps {
  data: ImportData | null;
  errors?: ImportError[];
}

export function ImportPreview({ data, errors = [] }: ImportPreviewProps) {
  const { t } = useTranslation("import");

  // Check if there's errors for a cell
  const hasCellError = (rowIndex: number, column: string): boolean => {
    return errors.some((e) => e.row === rowIndex + 1 && e.column === column);
  };

  // Get error message for a cell
  const getCellError = (rowIndex: number, column: string): string | null => {
    const error = errors.find(
      (e) => e.row === rowIndex + 1 && e.column === column,
    );
    return error?.message || null;
  };

  // Handle null data gracefully
  if (!data || !data.headers || data.headers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("messages.no-data")}
      </div>
    );
  }

  // Create columns for DataTable with error highlighting
  const columns: ColumnDef<TableRow, unknown>[] = (data.headers || []).map(
    (header, colIndex) => ({
      accessorKey: `col${colIndex}`,
      header: header,
      cell: ({ row }: { row: { original: TableRow } }) => {
        const rowIndex = parseInt(row.original.id.replace("row-", ""));
        const hasError = hasCellError(rowIndex, header);
        const errorMessage = getCellError(rowIndex, header);

        return (
          <div className="relative">
            {row.original[`col${colIndex}`]}
            {hasError && (
              <div
                className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"
                title={errorMessage || ""}
              />
            )}
          </div>
        );
      },
    }),
  );

  // Prepare data for DataTable with error flags
  const prepareDataForTable = (rows: ImportRow[]): TableRow[] => {
    return rows.map((row, rowIndex) => {
      const hasRowError = errors.some((e) => e.row === rowIndex + 1);
      return {
        id: `row-${rowIndex}`,
        hasError: hasRowError,
        ...row.reduce<
          Record<string, string | number | boolean | null | undefined>
        >((acc, cell, colIndex) => {
          acc[`col${colIndex}`] = cell;
          return acc;
        }, {}),
      };
    });
  };

  return (
    <div className="space-y-4">
      {/* Errors summary */}
      {errors.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">
            {t("validation.errors_found", { count: errors.length })}
          </span>
        </div>
      )}

      <div className="overflow-x-auto max-w-220 -mx-4 px-4">
        <DataTable
          columns={columns}
          data={prepareDataForTable(data.rows)}
          pageSize={25}
        />
      </div>
    </div>
  );
}
