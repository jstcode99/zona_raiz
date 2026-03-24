"use client"

import { useEffect, useRef } from "react"
import { Resolver, useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Form } from "@/components/ui/form"
import { propertyTypeOptions } from "@/domain/entities/property.entity"
import { IconMapPin, IconHome, IconClearAll } from "@tabler/icons-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import countries from '@/lib/countries.json'
import { PropertyType } from "@/domain/entities/property.enums"
import { objectToSearchParams, toNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  propertySearchSchema,
  PropertySearchFormInput,
  defaultPropertySearchValues,
} from "@/application/validation/property-search.schema"
import { useTranslation } from "react-i18next"

interface PropertyFiltersFormProps {
  onFiltersChange?: (filters: PropertySearchFormInput) => void
  debounceMs?: number
}


function parseSearchParams(sp: URLSearchParams | null): PropertySearchFormInput {
  if (!sp) return defaultPropertySearchValues
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
    real_estate_id: sp.get("real_estate_id") ?? null,
  }
}

function filtersToSearchParams(filters: PropertySearchFormInput) {
  return objectToSearchParams({
    q: filters.search as string | undefined,
    type: filters.type as string | undefined,
    country: filters.country as string | undefined,
    state: filters.state as string | undefined,
    city: filters.city as string | undefined,
    neighborhood: filters.neighborhood as string | undefined,
    street: filters.street as string | undefined,
    bedrooms: filters.bedrooms as number | undefined,
    bathrooms: filters.bathrooms as number | undefined,
  })
}

// ---------- component ----------

export function PropertyFiltersForm({
  onFiltersChange,
  debounceMs = 300,
}: PropertyFiltersFormProps) {
  const { t } = useTranslation("properties")

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const lastQueryRef = useRef("")
  const isSyncingFromUrl = useRef(false)

  const form = useForm<PropertySearchFormInput>({
    resolver: yupResolver(propertySearchSchema) as Resolver<PropertySearchFormInput>,
    defaultValues: parseSearchParams(searchParams),
    mode: "onChange",
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
      const params = filtersToSearchParams(values as PropertySearchFormInput)
      const queryString = params.toString()

      if (queryString === lastQueryRef.current) return

      lastQueryRef.current = queryString

      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.replace(newUrl, { scroll: false })
      onFiltersChange?.(values as PropertySearchFormInput)

    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [values, pathname, router, debounceMs, onFiltersChange])

  const handleReset = () => {
    lastQueryRef.current = ""
    form.reset(defaultPropertySearchValues)
    router.replace(pathname, { scroll: false })
    onFiltersChange?.(defaultPropertySearchValues)
  }

  const onSubmit = () => {}

  return (
    <Form form={form} className="space-y-3 bg-gray-500/10 p-4 rounded-md" onSubmit={onSubmit}>
      {/* Búsqueda rápida */}
      <div className="flex gap-2 items-center">
        <Form.Input
          name="search"
          label={t('words.search')}
          placeholder={t('words.search')}
        />
        <Button type="button" size="sm" onClick={handleReset} className="px-2 mt-8">
          <IconClearAll className="size-4 mr-1" />
          {t("actions.clear_filters")}
        </Button>
      </div>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground capitalize">
            <IconMapPin className="size-3" /> {t('sections.location')}
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
              label={t('words.location')}
            />
          </div>
          <Form.Input
            name="street"
            label={t('labels.street')}
            placeholder={t('placeholders.street')}
          />
          <Form.Input
            name="neighborhood"
            label={t('labels.neighborhood')}
            placeholder={t('placeholders.neighborhood')}
          />
        </div>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconHome className="size-3" /> {t('sections.features')}
          </span>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          <Form.Select
            name="type"
            label={t('labels.property_type')}
            placeholder={t('placeholders.select_property_type')}
            options={propertyTypeOptions}
          />
          <Form.Input
            name="minBedrooms"
            type="number"
            label={t('labels.bedrooms')}
            placeholder={t('placeholders.bedrooms')}
          />
          <Form.Input
            name="min_bathrooms"
            type="number"
            label={t('labels.bathrooms')}
            placeholder={t('placeholders.bathrooms')}
          />
        </div>
      </Form.Set>
    </Form >
  )
}