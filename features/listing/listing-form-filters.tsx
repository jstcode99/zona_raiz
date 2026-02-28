"use client"

import { useEffect, useMemo, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { PropertyFilters, propertyTypeOptions } from "@/domain/entities/property.entity"
import { IconMapPin, IconHome, IconX, IconClearAll } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import departments from '@/lib/departments.json'
import { PropertyType } from "@/domain/entities/property.enums"
import { objectToSearchParams, toNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface LocationData {
  value: string
  label: string
  cities: { value: string; label: string }[]
}

interface PropertyFiltersFormProps {
  onFiltersChange?: (filters: PropertyFilters) => void
  locations?: LocationData[]
  debounceMs?: number
}

const defaultLocations: LocationData[] = departments

function parseSearchParams(sp: URLSearchParams | null): PropertyFilters {
  if (!sp) return {}
  return {
    searchQuery: sp.get("q") ?? undefined,
    propertyType: sp.get("type") as PropertyType ?? undefined,
    realEstateId: sp.get("real_estate") ?? undefined,
    city: sp.get("city") ?? undefined,
    state: sp.get("state") ?? undefined,
    neighborhood: sp.get("neighborhood") ?? undefined,
    minBedrooms: toNumber(sp.get("min_bedrooms")),
    minBathrooms: toNumber(sp.get("min_bathrooms")),
  }
}

function filtersToSearchParams(filters: PropertyFilters) {
  return objectToSearchParams({
    q: filters.searchQuery,
    type: filters.propertyType,
    real_estate: filters.realEstateId,
    city: filters.city,
    state: filters.state,
    neighborhood: filters.neighborhood,
    min_bedrooms: filters.minBedrooms,
    min_bathrooms: filters.minBathrooms,
  })
}

// ---------- component ----------

export function PropertyFiltersForm({
  onFiltersChange,
  locations = defaultLocations,
  debounceMs = 300,
}: PropertyFiltersFormProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<PropertyFilters>({
    defaultValues: parseSearchParams(searchParams),
  })

  const values = useWatch({ control: form.control })
  const selectedState = values?.state

  const availableCities = useMemo(() => {
    if (!selectedState) return []
    const stateData = locations.find(l => l.value === selectedState)
    return stateData?.cities || []
  }, [selectedState, locations])

  // ciudad inválida → limpiar
  useEffect(() => {
    if (!selectedState) return
    const exists = availableCities.some(c => c.value === values.city)
    if (!exists) form.setValue("city", "")
  }, [selectedState, availableCities, values.city, form])

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

  // ---------- FORM → URL ----------
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

  const stateOptions = useMemo(() =>
    locations.map(l => ({ label: l.label, value: l.value })),
    [locations]
  )

  const handleReset = () => {
    lastQueryRef.current = ""
    form.reset({})
    router.replace(pathname, { scroll: false })
    onFiltersChange?.({})
  }

  return (
    <Form form={form} className="space-y-3">
      {/* Búsqueda rápida */}
      <div className="flex gap-2 items-center">
        <Form.Input
          name="searchQuery"
          label="Buscar propiedades"
          placeholder="Buscar propiedades..."
        />
        <Button type="button" size="sm" onClick={handleReset} className="px-2 mt-8">
          <IconClearAll className="size-4 mr-1" />
          Limpiar
        </Button>
      </div>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconMapPin className="size-3" /> Ubicación
          </span>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          <Form.Select
            name="state"
            label="Departamento"
            placeholder="Departamento"
            options={stateOptions}
          />
          <Form.Select
            name="city"
            label="Ciudad"
            placeholder="Ciudad"
            options={availableCities}
          />
          <Form.Input
            name="neighborhood"
            label="Barrio"
            placeholder="Barrio"
          />
        </div>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconHome className="size-3" /> Características
          </span>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          <Form.Select
            name="propertyType"
            label="Tipo"
            placeholder="Tipo"
            options={propertyTypeOptions}
          />
          <Form.Input
            name="minBedrooms"
            type="number"
            label="Hab. mín."
            placeholder="Hab. mín."
          />
          <Form.Input
            name="minBathrooms"
            type="number"
            label="Baños mín."
            placeholder="Baños mín."
          />
        </div>
      </Form.Set>
    </Form >
  )
}