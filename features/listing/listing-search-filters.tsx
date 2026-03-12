"use client"

import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { propertyTypeOptions, amenitiesOptions } from "@/domain/entities/property.entity"
import { ListingType } from "@/domain/entities/listing.enums"
import {
  IconMapPin,
  IconHome,
  IconClearAll,
  IconCurrencyDollar,
  IconBed,
  IconBath,
  IconCheckbox,
  IconTag,
} from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { toNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { listingTypeOptions } from "@/domain/entities/listing.entity"
import countries from '@/lib/countries.json'
import { useTranslation } from "react-i18next"

export interface ListingSearchFilters {
  q?: string
  listing_type?: ListingType
  type?: string
  country?: string
  state?: string
  city?: string
  neighborhood?: string
  street?: string
  min_price?: number
  max_price?: number
  min_bedrooms?: number
  min_bathrooms?: number
  amenities?: string[]
  sort_by?: string
  page?: number
  limit?: number
}

const defaultFilters: ListingSearchFilters = {
  q: "",
  listing_type: undefined,
  type: undefined,
  country: "",
  state: "",
  city: "",
  neighborhood: "",
  street: "",
  min_price: 0,
  max_price: 100000000,
  min_bedrooms: undefined,
  min_bathrooms: undefined,
  amenities: [],
  sort_by: "created_at_desc",
  page: 1,
  limit: 12,
}

function parseSearchParams(sp: URLSearchParams | null): ListingSearchFilters {
  if (!sp) return defaultFilters

  const amenities = sp.get("amenities")?.split(",").filter(Boolean) || []

  return {
    q: sp.get("q") || "",
    listing_type: sp.get("listing_type") as ListingType || undefined,
    type: sp.get("type") || undefined,
    country: sp.get("country") || "",
    state: sp.get("state") || "",
    city: sp.get("city") || "",
    neighborhood: sp.get("neighborhood") || "",
    street: sp.get("street") || "",
    min_price: toNumber(sp.get("min_price")) || 0,
    max_price: toNumber(sp.get("max_price")) || 100000000,
    min_bedrooms: toNumber(sp.get("min_bedrooms")) || undefined,
    min_bathrooms: toNumber(sp.get("min_bathrooms")) || undefined,
    amenities: amenities.length > 0 ? amenities : [],
    sort_by: sp.get("sort_by") || "created_at_desc",
    page: toNumber(sp.get("page")) || 1,
    limit: toNumber(sp.get("limit")) || 12,
  }
}

function filtersToSearchParams(filters: ListingSearchFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.q) params.set("q", filters.q)
  if (filters.listing_type) params.set("listing_type", filters.listing_type)
  if (filters.type) params.set("type", filters.type)
  if (filters.country) params.set("country", filters.country)
  if (filters.state) params.set("state", filters.state)
  if (filters.city) params.set("city", filters.city)
  if (filters.neighborhood) params.set("neighborhood", filters.neighborhood)
  if (filters.street) params.set("street", filters.street)
  if (filters.min_price && filters.min_price > 0) params.set("min_price", String(filters.min_price))
  if (filters.max_price && filters.max_price < 100000000) params.set("max_price", String(filters.max_price))
  if (filters.min_bedrooms) params.set("min_bedrooms", String(filters.min_bedrooms))
  if (filters.min_bathrooms) params.set("min_bathrooms", String(filters.min_bathrooms))
  if (filters.amenities && filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","))
  if (filters.sort_by) params.set("sort_by", filters.sort_by)
  if (filters.page && filters.page > 1) params.set("page", String(filters.page))
  if (filters.limit) params.set("limit", String(filters.limit))

  return params
}

interface ListingSearchFiltersProps {
  onFiltersChange?: (filters: ListingSearchFilters) => void
  debounceMs?: number
  initialFilters?: ListingSearchFilters
}

export function ListingSearchFilters({
  onFiltersChange,
  debounceMs = 300,
  initialFilters,
}: ListingSearchFiltersProps) {
  const { t } = useTranslation([
    "placeholders",
    "words",
    "sections"
  ]);

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<ListingSearchFilters>({
    defaultValues: initialFilters || parseSearchParams(searchParams),
  })

  const { control, setValue, reset, watch } = form
  const values = useWatch({ control: form.control })

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString())
    const incomingQuery = params.toString()

    if (incomingQuery === lastQueryRef.current) return

    const filters = parseSearchParams(params)
    isSyncingFromUrl.current = true
    lastQueryRef.current = incomingQuery

    reset(filters)
    onFiltersChange?.(filters)
  }, [searchParams, reset, onFiltersChange])

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
    reset(defaultFilters)
    router.replace(pathname, { scroll: false })
    onFiltersChange?.(defaultFilters)
  }

  const priceRange = watch(["min_price", "max_price"])

  const bedroomOptions = [
    { label: "Cualquiera", value: "" },
    { label: "1+", value: "1" },
    { label: "2+", value: "2" },
    { label: "3+", value: "3" },
    { label: "4+", value: "4" },
    { label: "5+", value: "5" },
  ]

  const bathroomOptions = [
    { label: "Cualquiera", value: "" },
    { label: "1+", value: "1" },
    { label: "2+", value: "2" },
    { label: "3+", value: "3" },
    { label: "4+", value: "4" },
  ]

  return (
    <Form form={form} onSubmit={() => { }} className="space-y-4">
      {/* Búsqueda rápida */}
      <div className="flex gap-2 items-end">
        <Form.Input
          name="q"
          placeholder={`${t('placeholders:search_properties')}...`}
          className="flex-1 py-2"
        />
        <Button type="button" size="sm" onClick={handleReset} variant="outline">
          <IconClearAll className="size-4" />
        </Button>
      </div>

      {/* Tipo de operación */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconTag className="size-4" /> {t('sections:type_listings')}
          </span>
        }
      >
        <ToggleGroup
          type="single"
          value={values.listing_type || ""}
          onValueChange={(value) => setValue("listing_type", value as ListingType || undefined)}
          className="flex gap-1"
        >
          {listingTypeOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      {/* Ubicación */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconMapPin className="size-4" /> {t('sections:location')}
          </span>
        }
      >
        <div className="space-y-3">
          <Form.CountryStateCity
            countryName="country"
            stateName="state"
            cityName="city"
            countries={countries}
            control={control}
          />
          <Form.Input
            name="neighborhood"
            placeholder="Barrio"
          />
        </div>
      </Form.Set>

      {/* Rango de precio */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconCurrencyDollar className="size-4" /> {t('sections:price_range')}
          </span>
        }
      >
        <div className="space-y-2">
          <Slider
            value={[values.min_price || 0, values.max_price || 100000000]}
            onValueChange={(value) => {
              setValue("min_price", value[0])
              setValue("max_price", value[1])
            }}
            max={100000000}
            step={1000000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${(priceRange[0] || 0).toLocaleString("es-ES")}</span>
            <span>${(priceRange[1] || 100000000).toLocaleString("es-ES")}</span>
          </div>
        </div>
      </Form.Set>

      {/* Tipo de propiedad */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconHome className="size-4" /> {t('sections:type_properties')}
          </span>
        }
      >
        <ToggleGroup
          type="multiple"
          value={values.type ? [values.type] : []}
          onValueChange={(value) => setValue("type", value[0] || undefined)}
          size="sm"
          className="flex flex-wrap gap-1"
        >
          {propertyTypeOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="text-xs px-2 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      {/* Habitaciones */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconBed className="size-4" /> {t('sections:rooms')}
          </span>
        }
      >
        <ToggleGroup
          type="single"
          value={String(values.min_bedrooms || "")}
          onValueChange={(value) => setValue("min_bedrooms", value ? Number(value) : undefined)}
          className="flex gap-1"
        >
          {bedroomOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      {/* Baños */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconBath className="size-4" /> {t('sections:bathrooms')}
          </span>
        }
      >
        <ToggleGroup
          type="single"
          value={String(values.min_bathrooms || "")}
          onValueChange={(value) => setValue("min_bathrooms", value ? Number(value) : undefined)}
          className="flex gap-1"
        >
          {bathroomOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      {/* Comodidades */}
      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-sm font-medium">
            <IconCheckbox className="size-4" /> {t('sections:amenities')}
          </span>
        }
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenitiesOptions.map((amenity) => (
            <div key={amenity.value} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity.value}`}
                checked={values.amenities?.includes(amenity.value)}
                onCheckedChange={(checked) => {
                  const current = values.amenities || []
                  if (checked) {
                    setValue("amenities", [...current, amenity.value])
                  } else {
                    setValue("amenities", current.filter((a) => a !== amenity.value))
                  }
                }}
              />
              <label
                htmlFor={`amenity-${amenity.value}`}
                className="text-sm cursor-pointer"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </Form.Set>

      {values.amenities && values.amenities.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => setValue("amenities", [])} className="w-full">
          {t('actions:clear_amenities')}
        </Button>
      )}
    </Form>
  )
}

export { defaultFilters }
