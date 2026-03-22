"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { EnquiryRow } from "./enquiry-columns";
import { use } from "react";
import { getEnquiryColumns } from "./enquiry-columns";

interface EnquiryTableProps {
  enquiries: Promise<EnquiryRow[]>;
  realEstateId: string;
  columns?: ColumnDef<EnquiryRow>[];
}

export default function InquiryTable({
  enquiries,
  realEstateId,
  columns,
}: EnquiryTableProps) {
  const data = use(enquiries);
  const cols = columns ?? getEnquiryColumns(realEstateId);
  return (
    <DataTable
      data={data}
      columns={cols}
      enableRowSelection={false}
      enableDrag={false}
    />
  );
}
