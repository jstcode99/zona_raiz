"use client"

import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { propertyTypeOptions } from "@/domain/entities/property.entity"
import { IconMapPin, IconHome, IconClearAll } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import countries from '@/lib/countries.json'
import { PropertyType } from "@/domain/entities/property.enums"
import { objectToSearchParams, toNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PropertySearchFormInput } from "@/application/validation/property-search.schema"

interface PropertyFiltersFormProps {
  onFiltersChange?: (filters: PropertySearchFormInput) => void
  debounceMs?: number
}


function parseSearchParams(sp: URLSearchParams | null): PropertySearchFormInput {
  if (!sp) return {}
  return {
    search: sp.get("q") ?? undefined,
    type: sp.get("type") as PropertyType ?? undefined,
    country: sp.get("country") ?? undefined,
    state: sp.get("state") ?? undefined,
    neighborhood: sp.get("neighborhood") ?? undefined,
    street: sp.get("street") ?? undefined,
    city: sp.get("city") ?? undefined,
    bathrooms: toNumber(sp.get("bathrooms")),
    bedrooms: toNumber(sp.get("bedrooms")),
  }
}

function filtersToSearchParams(filters: PropertySearchFormInput) {
  return objectToSearchParams({
    q: filters.search,
    type: filters.type,
    country: filters.country,
    state: filters.state,
    city: filters.city,
    neighborhood: filters.neighborhood,
    street: filters.street,
    bedrooms: filters.bathrooms,
    bathrooms: filters.bedrooms,
  })
}

// ---------- component ----------

export function PropertyFiltersForm({
  onFiltersChange,
  debounceMs = 300,
}: PropertyFiltersFormProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<PropertySearchFormInput>({
    defaultValues: parseSearchParams(searchParams),
  })

  const { control } = form
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

  const handleReset = () => {
    lastQueryRef.current = ""
    form.reset({})
    router.replace(pathname, { scroll: false })
    onFiltersChange?.({})
  }

  return (
    <Form form={form} className="space-y-3 bg-gray-500/10 p-4 rounded-md">
      {/* Búsqueda rápida */}
      <div className="flex gap-2 items-center">
        <Form.Input
          name="search_query"
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
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2">
            <Form.CountryStateCity
              countryName="country"
              stateName="state"
              cityName="city"
              countries={countries}
              control={control}
              label={"Ubicación Pais/ Estado / Ciudad"}
            />
          </div>
          <Form.Input
            name="street"
            label="Calle"
            placeholder="Calle"
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
            name="type"
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
            name="min_bathrooms"
            type="number"
            label="Baños mín."
            placeholder="Baños mín."
          />
        </div>
      </Form.Set>
    </Form >
  )
}