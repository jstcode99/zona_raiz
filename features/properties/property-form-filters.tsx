"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { PropertyType, propertyTypeOptions } from "@/domain/entities/property.entity"
import { IconX, IconMapPin, IconHome, IconMoneybag } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import departments from '@/lib/departments.json';

export interface PropertyFilters {
  realEstateId?: string
  propertyType?: PropertyType
  city?: string
  state?: string
  neighborhood?: string
  minBedrooms?: number
  minBathrooms?: number
  minPrice?: number
  maxPrice?: number
  searchQuery?: string
}

interface LocationData {
  value: string
  label: string
  cities: { value: string; label: string }[]
}

interface PropertyFiltersFormProps {
  onFiltersChange?: (filters: PropertyFilters) => void
  locations?: LocationData[]
  realEstateOptions?: { label: string; value: string }[]
  neighborhoodOptions?: { label: string; value: string }[]
  debounceMs?: number
}



const defaultLocations: LocationData[] = departments

function parseSearchParams(searchParams: URLSearchParams | null): PropertyFilters {
  if (!searchParams) return {}

  const getNumber = (key: string) => {
    const val = searchParams.get(key)
    return val ? parseInt(val, 10) : undefined
  }

  return {
    searchQuery: searchParams.get("q") || undefined,
    propertyType: (searchParams.get("type") as PropertyType) || undefined,
    realEstateId: searchParams.get("real_estate") || undefined,
    city: searchParams.get("city") || undefined,
    state: searchParams.get("state") || undefined,
    neighborhood: searchParams.get("neighborhood") || undefined,
    minBedrooms: getNumber("min_bedrooms"),
    minBathrooms: getNumber("min_bathrooms"),
    minPrice: getNumber("min_price"),
    maxPrice: getNumber("max_price"),
  }
}

function filtersToSearchParams(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.searchQuery) params.set("q", filters.searchQuery)
  if (filters.propertyType) params.set("type", filters.propertyType)
  if (filters.realEstateId) params.set("real_estate", filters.realEstateId)
  if (filters.city) params.set("city", filters.city)
  if (filters.state) params.set("state", filters.state)
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood)
  if (filters.minBedrooms !== undefined) params.set("min_bedrooms", String(filters.minBedrooms))
  if (filters.minBathrooms !== undefined) params.set("min_bathrooms", String(filters.minBathrooms))
  if (filters.minPrice !== undefined) params.set("min_price", String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set("max_price", String(filters.maxPrice))

  return params
}

export function PropertyFiltersForm({
  onFiltersChange,
  locations = defaultLocations,
  realEstateOptions = [],
  neighborhoodOptions = [],
  debounceMs = 300,
}: PropertyFiltersFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isInitialized, setIsInitialized] = useState(false)

  const initialFilters = parseSearchParams(searchParams)

  const form = useForm<PropertyFilters>({
    defaultValues: initialFilters,
  })

  // Watch state para filtrar ciudades
  const selectedState = useWatch({ control: form.control, name: "state" })

  // Ciudades disponibles según estado seleccionado
  const availableCities = useMemo(() => {
    if (!selectedState) return []
    const stateData = locations.find(l => l.value === selectedState)
    return stateData?.cities || []
  }, [selectedState, locations])

  // Resetear ciudad cuando cambia el estado
  useEffect(() => {
    const currentCity = form.getValues("city")
    const cityExists = availableCities.some(c => c.value === currentCity)

    if (selectedState && !cityExists) {
      form.setValue("city", "")
    }
  }, [selectedState, availableCities, form])

  // Inicialización y sync con URL
  useEffect(() => {
    if (!isInitialized) {
      const filters = parseSearchParams(searchParams)
      form.reset(filters)
      onFiltersChange && onFiltersChange(filters)
      setIsInitialized(true)
      return
    }

    const currentFilters = parseSearchParams(searchParams)
    const formValues = form.getValues()

    const isDifferent = JSON.stringify(currentFilters) !== JSON.stringify(formValues)

    if (isDifferent) {
      form.reset(currentFilters)
      onFiltersChange && onFiltersChange(currentFilters)
    }
  }, [searchParams, form, onFiltersChange, isInitialized])

  // Debounce para actualizar URL
  useEffect(() => {
    if (!isInitialized) return

    const subscription = form.watch((value) => {
      const timeout = setTimeout(() => {
        const filters = value as PropertyFilters
        const params = filtersToSearchParams(filters)
        const queryString = params.toString()
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname

        router.replace(newUrl, { scroll: false })
        onFiltersChange && onFiltersChange(filters)
      }, debounceMs)

      return () => clearTimeout(timeout)
    })

    return () => subscription.unsubscribe()
  }, [form, pathname, router, onFiltersChange, debounceMs, isInitialized])

  const handleReset = () => {
    const emptyFilters: PropertyFilters = {
      realEstateId: "",
      propertyType: undefined,
      city: "",
      state: "",
      neighborhood: "",
      minBedrooms: undefined,
      minBathrooms: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      searchQuery: "",
    }

    form.reset(emptyFilters)
    router.replace(pathname, { scroll: false })
    onFiltersChange && onFiltersChange({})
  }

  const hasActiveFilters = Object.values(form.watch()).some(v =>
    v !== undefined && v !== "" && v !== null
  )

  const stateOptions = useMemo(() =>
    locations.map(l => ({ label: l.label, value: l.value })),
    [locations]
  )

  const handleSubmit = () => { }

  if (!isInitialized) return null

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-3">
      {/* Búsqueda rápida */}
      <div className="flex gap-2">
        <Form.Input
          name="searchQuery"
          label="Buscar propiedades"
          placeholder="Buscar propiedades..."
        />
        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="h-9 px-2">
            <IconX className="size-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Ubicación */}
        <Form.Set
          legend={
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <IconMapPin className="size-3" /> Ubicación
            </span>
          }
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Select
              name="state"
              label="Departamento"
              placeholder="Departamento"
              options={stateOptions}
            />
            <Form.Select
              label="Ciudad"
              name="city"
              placeholder={selectedState ? "Ciudad" : "Seleccione dpto."}
              options={availableCities}
            />
          </div>
          {neighborhoodOptions.length > 0 ? (
            <Form.Select
              label="Localidad | Barrio"
              name="neighborhood"
              placeholder="Barrio"
              options={neighborhoodOptions}
            />
          ) : (
            <Form.Input
              label="Localidad | Barrio"
              name="neighborhood"
              placeholder="Barrio (opcional)"
            />
          )}
        </Form.Set>

        {/* Tipo y Características */}
        <Form.Set
          legend={
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <IconHome className="size-3" /> Tipo y Características
            </span>
          }
        >
          <Form.Select
            name="propertyType"
            label="Tipo de propiedad"
            placeholder="Tipo de propiedad"
            options={propertyTypeOptions}
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Form.Input
              label="Hab. mín."
              name="minBedrooms"
              type="number"
              placeholder="Hab. mín."
              min={0}
            />
            <Form.Input
              name="minBathrooms"
              type="number"
              label="Baños mín."
              placeholder="Baños mín."
              min={0}
            />
          </div>
        </Form.Set>

        {/* Precio y Agente */}
        <Form.Set
          legend={
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <IconMoneybag className="size-3" /> Precio y Agente</span>
          }
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Input
              name="minPrice"
              type="number"
              label="Precio mín."
              placeholder="Precio mín."
              min={0}
            />
            <Form.Input
              name="maxPrice"
              type="number"
              label="Precio máx."
              placeholder="Precio máx."
              min={0}
            />
          </div>
          {realEstateOptions.length > 0 && (
            <Form.Select
              name="realEstateId"
              placeholder="Inmobiliaria"
              options={realEstateOptions}
            />
          )}
        </Form.Set>
      </div>
    </Form>
  )
}