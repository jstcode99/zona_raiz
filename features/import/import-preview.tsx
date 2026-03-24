"use client";

import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/ui/data-table";
import { AlertTriangle, ChevronsUpDown, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { ImportData, ImportRow, ImportError } from "./import.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
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
    return errors.some(
      (e) =>
        e.row === rowIndex + 1 && (e.column === column || e.column === "all"), // 👈
    );
  };

  // Get error message for a cell
  const getCellError = (rowIndex: number, column: string): string | null => {
    const error = errors.find(
      (e) =>
        e.row === rowIndex + 1 && (e.column === column || e.column === "all"), // 👈
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
        // 👇 Leer rowIndex directamente del objeto, no parseando el id
        const rowIndex = row.original._rowIndex as number;
        const hasError = hasCellError(rowIndex, header);
        const errorMessage = getCellError(rowIndex, header);
        return (
          <div
            className={`relative px-1 -mx-1 rounded ${
              hasError ? "bg-destructive/15 ring-1 ring-destructive/40" : ""
            }`}
            title={errorMessage || undefined}
          >
            <span className={hasError ? "text-destructive font-medium" : ""}>
              {row.original[`col${colIndex}`] ?? (
                <span className="text-muted-foreground italic text-xs">—</span>
              )}
            </span>
            {hasError && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="inline-block ml-1 h-3 w-3 text-destructive" />
                </TooltipTrigger>
                <TooltipContent side={"top"}>
                  <p>{errorMessage}</p>
                </TooltipContent>
              </Tooltip>
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
        _rowIndex: rowIndex, // 👈 guardar índice numérico directamente
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
      {errors.length > 0 ? (
        <Collapsible className="space-y-3 max-h-35 overflow-auto">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle />
            <AlertDescription>
              {t("validation.errors_found", { count: errors.length })}
            </AlertDescription>
            <AlertAction>
              <CollapsibleTrigger asChild>
                <Button size="xs" type="button" variant="ghost">
                  <ChevronsUpDown />
                </Button>
              </CollapsibleTrigger>
            </AlertAction>
          </Alert>
          <CollapsibleContent className="flex flex-col items-start gap-1 pt-0 text-sm">
            {errors.length > 0 &&
              errors.map((e, i) => (
                <Item variant="outline" size="sm" key={i}>
                  <ItemMedia>
                    <AlertTriangle className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {t("validation.row", { row: e.row })}: {e.message}
                    </ItemTitle>
                  </ItemContent>
                </Item>
              ))}
          </CollapsibleContent>
        </Collapsible>
      ) : null}

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
