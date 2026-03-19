"use client"

import { useEffect, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { propertyTypeOptions, amenitiesOptions } from "@/domain/entities/property.entity"
import { ListingType } from "@/domain/entities/listing.enums"
import {
  IconMapPin, IconHome, IconClearAll, IconCurrencyDollar,
  IconBed, IconBath, IconCheckbox, IconTag,
} from "@tabler/icons-react"
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

export const defaultFilters: ListingSearchFilters = {
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

interface ListingSearchFiltersProps {
  initialFilters?: ListingSearchFilters
  onFiltersChange: (filters: ListingSearchFilters) => void
  debounceMs?: number
}

export function ListingSearchFilters({
  initialFilters,
  onFiltersChange,
  debounceMs = 300,
}: ListingSearchFiltersProps) {
  const { t } = useTranslation("listings")
  const isExternalUpdate = useRef(false)


  const form = useForm<ListingSearchFilters>({
    defaultValues: initialFilters ?? defaultFilters,
  })

  const { control, setValue, reset, watch } = form
  const values = useWatch({ control })
  const priceRange = watch(["min_price", "max_price"])

  // Notifica cambios con debounce
  useEffect(() => {
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false
      return
    }

    const timeout = setTimeout(() => {
      onFiltersChange(values as ListingSearchFilters)
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [values, debounceMs, onFiltersChange])

  // Sincroniza si cambian los initialFilters desde afuera
  useEffect(() => {
    if (initialFilters) {
      isExternalUpdate.current = true
      reset(initialFilters)
    }
  }, [initialFilters, reset])

  const handleReset = () => {
    reset(defaultFilters)
    onFiltersChange(defaultFilters)
  }

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
      <div className="flex gap-2 items-end">
        <Form.Input
          name="q"
          placeholder={`${t('placeholders.search_properties')}...`}
          className="flex-1 py-2"
        />
        <Button type="button" size="sm" onClick={handleReset} variant="outline">
          <IconClearAll className="size-4" />
        </Button>
      </div>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconTag className="size-4" />{t('sections.type_listings')}</span>}>
        <ToggleGroup
          type="single"
          value={values.listing_type || ""}
          onValueChange={(value) => setValue("listing_type", value as ListingType || undefined)}
          className="flex gap-1"
        >
          {listingTypeOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}
              className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconMapPin className="size-4" />{t('sections.location')}</span>}>
        <div className="space-y-3">
          <Form.CountryStateCity
            countryName="country"
            stateName="state"
            cityName="city"
            countries={countries}
            control={control}
          />
          <Form.Input name="neighborhood" placeholder="Barrio" />
        </div>
      </Form.Set>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconCurrencyDollar className="size-4" />{t('sections.price_range')}</span>}>
        <div className="space-y-2">
          <Slider
            value={[values.min_price || 0, values.max_price || 100000000]}
            onValueChange={([min, max]) => { setValue("min_price", min); setValue("max_price", max) }}
            max={100000000}
            step={1000000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${(priceRange[0] || 0).toLocaleString("es-ES")}</span>
            <span>${(priceRange[1] || 100000000).toLocaleString("es-ES")}</span>
          </div>
        </div>
      </Form.Set>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconHome className="size-4" />{t('sections.type_properties')}</span>}>
        <ToggleGroup
          type="multiple"
          value={values.type ? [values.type] : []}
          onValueChange={(value) => setValue("type", value[0] || undefined)}
          size="sm"
          className="flex flex-wrap gap-1"
        >
          {propertyTypeOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}
              className="text-xs px-2 py-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconBed className="size-4" />{t('sections.rooms')}</span>}>
        <ToggleGroup
          type="single"
          value={String(values.min_bedrooms || "")}
          onValueChange={(value) => setValue("min_bedrooms", value ? Number(value) : undefined)}
          className="flex gap-1"
        >
          {bedroomOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}
              className="flex-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconBath className="size-4" />{t('sections.bathrooms')}</span>}>
        <ToggleGroup
          type="single"
          value={String(values.min_bathrooms || "")}
          onValueChange={(value) => setValue("min_bathrooms", value ? Number(value) : undefined)}
          className="flex gap-1"
        >
          {bathroomOptions.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}
              className="flex-1 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set legend={<span className="flex items-center gap-1 text-sm font-medium"><IconCheckbox className="size-4" />{t('sections.amenities')}</span>}>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenitiesOptions.map((amenity) => (
            <div key={amenity.value} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity.value}`}
                checked={values.amenities?.includes(amenity.value)}
                onCheckedChange={(checked) => {
                  const current = values.amenities || []
                  setValue("amenities", checked
                    ? [...current, amenity.value]
                    : current.filter((a) => a !== amenity.value)
                  )
                }}
              />
              <label htmlFor={`amenity-${amenity.value}`} className="text-sm cursor-pointer">
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </Form.Set>

      {values.amenities && values.amenities.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => setValue("amenities", [])} className="w-full">
          {t('actions.clear_amenities')}
        </Button>
      )}
    </Form>
  )
}