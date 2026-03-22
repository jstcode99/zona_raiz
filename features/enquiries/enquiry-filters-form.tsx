"use client";

import { useEffect, useRef } from "react";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import {
  enquiryStatusOptions,
  enquirySourceOptions,
} from "@/domain/entities/enquiry.entity";
import { IconClearAll, IconSearch } from "@tabler/icons-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { objectToSearchParams } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  enquirySearchSchema,
  EnquirySearchFormInput,
  defaultEnquirySearchValues,
} from "@/application/validation/enquiry-search.schema";
import { useTranslation } from "react-i18next";

interface EnquiryFiltersFormProps {
  onFiltersChange?: (filters: EnquirySearchFormInput) => void;
  debounceMs?: number;
}

function parseSearchParams(sp: URLSearchParams | null): EnquirySearchFormInput {
  if (!sp) return {};
  return {
    search: sp.get("search") ?? undefined,
    status: sp.get("status") ?? undefined,
    source: sp.get("source") ?? undefined,
    start_date: sp.get("start_date") ?? undefined,
    end_date: sp.get("end_date") ?? undefined,
  };
}

function filtersToSearchParams(filters: EnquirySearchFormInput) {
  return objectToSearchParams({
    search: filters.search,
    status: filters.status,
    source: filters.source,
    start_date: filters.start_date,
    end_date: filters.end_date,
  });
}

export function EnquiryFiltersForm({
  onFiltersChange,
  debounceMs = 300,
}: EnquiryFiltersFormProps) {
  const { t } = useTranslation("enquiries");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastQueryRef = useRef("");
  const isSyncingFromUrl = useRef(false);

  const form = useForm<EnquirySearchFormInput>({
    resolver: yupResolver(
      enquirySearchSchema,
    ) as Resolver<EnquirySearchFormInput>,
    defaultValues:
      parseSearchParams(searchParams) ?? defaultEnquirySearchValues,
    mode: "onChange",
  });

  const { control } = form;
  const values = useWatch({ control: form.control });

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    const incomingQuery = params.toString();

    if (incomingQuery === lastQueryRef.current) return;

    const filters = parseSearchParams(params);

    isSyncingFromUrl.current = true;
    lastQueryRef.current = incomingQuery;

    form.reset(filters);
    onFiltersChange?.(filters);
  }, [searchParams, form, onFiltersChange]);

  useEffect(() => {
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      const params = filtersToSearchParams(values);
      const queryString = params.toString();

      if (queryString === lastQueryRef.current) return;

      lastQueryRef.current = queryString;

      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
      onFiltersChange?.(values);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [values, pathname, router, debounceMs, onFiltersChange]);

  const handleReset = () => {
    lastQueryRef.current = "";
    form.reset({});
    router.replace(pathname, { scroll: false });
    onFiltersChange?.({});
  };

  const onSubmit = () => {};

  return (
    <Form
      form={form}
      className="space-y-3 bg-gray-500/10 p-4 rounded-md"
      onSubmit={onSubmit}
    >
      <div className="flex gap-2 items-center">
        <Form.Input
          name="search"
          label={t("words:search")}
          placeholder={t("words:search")}
        />
        <Button
          type="button"
          size="sm"
          onClick={handleReset}
          className="px-2 mt-8"
        >
          <IconClearAll className="size-4 mr-1" />
        </Button>
      </div>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            {t("words:filters")}
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Select
            name="status"
            label={t("columns.headers.status")}
            placeholder={t("columns.headers.status")}
            options={enquiryStatusOptions}
          />
          <Form.Select
            name="source"
            label={t("columns.headers.source")}
            placeholder={t("columns.headers.source")}
            options={enquirySourceOptions}
          />
          <Form.Input
            name="start_date"
            type="date"
            label={t("columns.headers.start_date")}
          />
          <Form.Input
            name="end_date"
            type="date"
            label={t("columns.headers.end_date")}
          />
        </div>
      </Form.Set>
    </Form>
  );
}
