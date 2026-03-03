"use client"

import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { IconClearAll } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { objectToSearchParams } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RealEstateFilters } from "@/domain/entities/real-estate.entity"

interface RealEstateFiltersFormProps {
  onFiltersChange?: (filters: RealEstateFilters) => void
  debounceMs?: number
}

function parseSearchParams(sp: URLSearchParams | null): RealEstateFilters {
  if (!sp) return {}
  return {
    searchQuery: sp.get("q") ?? undefined,
    whatsapp: sp.get("whatsapp") ?? undefined,
  }
}

function filtersToSearchParams(filters: RealEstateFilters) {
  return objectToSearchParams({
    q: filters.searchQuery,
    whatsapp: filters.whatsapp
  })
}

export function RealEstateFiltersForm({
  onFiltersChange,
  debounceMs = 300,
}: RealEstateFiltersFormProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<RealEstateFilters>({
    defaultValues: parseSearchParams(searchParams),
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

  return (
    <Form form={form} className="space-y-3 bg-gray-500/10 p-4 rounded-md">
      <div className="flex gap-2 items-center">
        <Form.Input
          name="searchQuery"
          label="Buscar inmobiliaria"
          placeholder="Buscar inmobiliaria..."
        />
        <Form.Phone
          name="whatsapp"
          label="WhatsApp"
          placeholder="##########"
        />
        <Button type="button" size="sm" onClick={handleReset} className="px-2 mt-8">
          <IconClearAll className="size-4 mr-1" />
          Limpiar
        </Button>
      </div>
    </Form >
  )
}