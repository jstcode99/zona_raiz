"use client"

import { useEffect, useRef } from "react"
import { Resolver, useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Form } from "@/components/ui/form"
import { IconClearAll } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { objectToSearchParams } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  realEstateFiltersSchema,
  RealEstateFiltersFormInput,
  defaultRealEstateFiltersValues,
} from "@/application/validation/real-estate-filters.schema"
import { useTranslation } from "react-i18next"

interface RealEstateFiltersFormProps {
  onFiltersChange?: (filters: RealEstateFiltersFormInput) => void
  debounceMs?: number
}

function parseSearchParams(sp: URLSearchParams | null): RealEstateFiltersFormInput {
  if (!sp) return defaultRealEstateFiltersValues
  return {
    searchQuery: sp.get("q") ?? null,
    whatsapp: sp.get("whatsapp") ?? null,
  }
}

function filtersToSearchParams(filters: RealEstateFiltersFormInput) {
  return objectToSearchParams({
    q: filters.searchQuery,
    whatsapp: filters.whatsapp
  })
}

export function RealEstateFiltersForm({
  onFiltersChange,
  debounceMs = 300,
}: RealEstateFiltersFormProps) {
  const { t } = useTranslation("real-estates")

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<RealEstateFiltersFormInput>({
    resolver: yupResolver(realEstateFiltersSchema) as Resolver<RealEstateFiltersFormInput>,
    defaultValues: parseSearchParams(searchParams),
    mode: "onChange",
  })

  const values = useWatch({ control: form.control })

  // ---------- URL → FORM ----------
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
      const params = filtersToSearchParams(values as RealEstateFiltersFormInput)
      const queryString = params.toString()

      if (queryString === lastQueryRef.current) return

      lastQueryRef.current = queryString

      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.replace(newUrl, { scroll: false })
      onFiltersChange?.(values as RealEstateFiltersFormInput)

    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [values, pathname, router, debounceMs, onFiltersChange])


  const handleReset = () => {
    lastQueryRef.current = ""
    form.reset(defaultRealEstateFiltersValues)
    router.replace(pathname, { scroll: false })
    onFiltersChange?.(defaultRealEstateFiltersValues)
  }

  const onSubmit = () => {}

  return (
    <Form form={form} className="space-y-3 bg-gray-500/10 p-4 rounded-md" onSubmit={onSubmit}>
      <div className="flex gap-2 items-center">
        <Form.Input
          name="searchQuery"
          label={t("labels.search")}
          placeholder={t("placeholders.search")}
        />
        <Form.Phone
          name="whatsapp"
          label={t("labels.whatsapp")}
          placeholder={t("placeholders.whatsapp")}
        />
        <Button type="button" size="sm" onClick={handleReset} className="px-2 mt-8">
          <IconClearAll className="size-4 mr-1" />
          {t("actions.clear_filters")}
        </Button>
      </div>
    </Form >
  )
}