"use client"

import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { inquiryStatusOptions, inquirySourceOptions } from "@/domain/entities/inquiry.entity"
import { IconClearAll, IconSearch } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { objectToSearchParams } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { InquirySearchFormInput } from "@/application/validation/inquiry-search.schema"
import { useTranslation } from "react-i18next"

interface InquiryFiltersFormProps {
  onFiltersChange?: (filters: InquirySearchFormInput) => void
  debounceMs?: number
}

function parseSearchParams(sp: URLSearchParams | null): InquirySearchFormInput {
  if (!sp) return {}
  return {
    search: sp.get("search") ?? undefined,
    status: sp.get("status") ?? undefined,
    source: sp.get("source") ?? undefined,
    start_date: sp.get("start_date") ?? undefined,
    end_date: sp.get("end_date") ?? undefined,
  }
}

function filtersToSearchParams(filters: InquirySearchFormInput) {
  return objectToSearchParams({
    search: filters.search,
    status: filters.status,
    source: filters.source,
    start_date: filters.start_date,
    end_date: filters.end_date,
  })
}

export function InquiryFiltersForm({
  onFiltersChange,
  debounceMs = 300,
}: InquiryFiltersFormProps) {
  const { t } = useTranslation("inquiries")

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<InquirySearchFormInput>({
    defaultValues: parseSearchParams(searchParams),
  })

  const { control } = form
  const values = useWatch({ control: form.control })

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString())
    const incomingQuery = params.toString()

    if (incomingQuery === lastQueryRef.current) return

    const filters = parseSearchParams(params)

    isSyncingFromUrl.current = true
    lastQueryRef.current = incomingQuery

    form.reset(filters)
    onFiltersChange?.(filters)

  }, [searchParams, form, onFiltersChange])

  useEffect(() => {
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false
      return
    }

    const timeout = setTimeout(() => {
      const params = filtersToSearchParams(values)
      const queryString = params.toString()

      if (queryString === lastQueryRef.current) return

      lastQueryRef.current = queryString

      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.replace(newUrl, { scroll: false })
      onFiltersChange?.(values)

    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [values, pathname, router, debounceMs, onFiltersChange])

  const handleReset = () => {
    lastQueryRef.current = ""
    form.reset({})
    router.replace(pathname, { scroll: false })
    onFiltersChange?.({})
  }

  const onSubmit = () => {}

  return (
    <Form form={form} className="space-y-3 bg-gray-500/10 p-4 rounded-md" onSubmit={onSubmit}>
      <div className="flex gap-2 items-center">
        <Form.Input
          name="search"
          label={t('words:search')}
          placeholder={t('words:search')}
        />
        <Button type="button" size="sm" onClick={handleReset} className="px-2 mt-8">
          <IconClearAll className="size-4 mr-1" />
        </Button>
      </div>

      <Form.Set legend={<span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">Filtros</span>}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Select
            name="status"
            label="Estado"
            placeholder="Estado"
            options={inquiryStatusOptions}
          />
          <Form.Select
            name="source"
            label="Fuente"
            placeholder="Fuente"
            options={inquirySourceOptions}
          />
          <Form.Input
            name="start_date"
            type="date"
            label="Desde"
          />
          <Form.Input
            name="end_date"
            type="date"
            label="Hasta"
          />
        </div>
      </Form.Set>
    </Form>
  )
}
