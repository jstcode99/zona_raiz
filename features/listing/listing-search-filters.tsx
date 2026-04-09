"use client";

import { useEffect, useRef } from "react";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import {
  propertyTypeOptions,
  amenitiesOptions,
} from "@/domain/entities/property.entity";
import { ListingType } from "@/domain/entities/listing.enums";
import {
  IconMapPin,
  IconHome,
  IconClearAll,
  IconCurrencyDollar,
  IconBed,
  IconBath,
  IconCheckbox,
  IconTag,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useListingOptions } from "./hooks/use-listing-options";
import { useTranslation } from "react-i18next";
import {
  listingSearchFiltersSchema,
  ListingSearchFiltersInput,
  defaultListingSearchFiltersValues,
  defaultFilters,
} from "@/application/validation/listing-search-full.schema";
import { PlaceSearch, ParsedPlace } from "../places/place-search";
import { useParams } from "next/navigation";
import { CITY_LABELS, STATE_LABELS } from "@/lib/locations";

export { defaultFilters };
export type { ListingSearchFiltersInput };

interface ListingSearchFiltersProps {
  initialFilters?: ListingSearchFiltersInput;
  onFiltersChange: (filters: ListingSearchFiltersInput) => void;
  debounceMs?: number;
}

export function ListingSearchFilters({
  initialFilters,
  onFiltersChange,
  debounceMs = 300,
}: ListingSearchFiltersProps) {
  const { t, i18n } = useTranslation("listings");
  const { listingTypeOptions } = useListingOptions();
  const isExternalUpdate = useRef(false);
  const { lang } = useParams();

  const form = useForm<ListingSearchFiltersInput>({
    resolver: yupResolver(
      listingSearchFiltersSchema,
    ) as Resolver<ListingSearchFiltersInput>,
    defaultValues: initialFilters ?? defaultListingSearchFiltersValues,
    mode: "onChange",
  });

  const { control, setValue, reset, watch } = form;
  const values = useWatch({ control });
  const priceRange = watch(["min_price", "max_price"]);

  // Notifica cambios con debounce
  useEffect(() => {
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      onFiltersChange(values as ListingSearchFiltersInput);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [values, debounceMs, onFiltersChange]);

  // Sincroniza si cambian los initialFilters desde afuera
  useEffect(() => {
    if (initialFilters) {
      isExternalUpdate.current = true;
      reset(initialFilters);
    }
  }, [initialFilters, reset]);

  const handleReset = () => {
    reset(defaultListingSearchFiltersValues);
    onFiltersChange(defaultListingSearchFiltersValues);
  };

  const bedroomOptions = [
    { label: t("actions.any"), value: "" },
    { label: "1+", value: "1" },
    { label: "2+", value: "2" },
    { label: "3+", value: "3" },
    { label: "4+", value: "4" },
    { label: "5+", value: "5" },
  ];

  const bathroomOptions = [
    { label: t("actions.any"), value: "" },
    { label: "1+", value: "1" },
    { label: "2+", value: "2" },
    { label: "3+", value: "3" },
    { label: "4+", value: "4" },
  ];

  return (
    <Form form={form} onSubmit={() => {}} className="space-y-3 bg-gray-500/10 p-4 rounded-md">
      <div className="flex gap-2 items-end">
        <Form.Input
          name="q"
          placeholder={`${t("placeholders.search_properties")}...`}
          className="flex-1 py-2"
        />
        <Button type="button" size="sm" onClick={handleReset} variant="outline" className="px-2">
          <IconClearAll className="size-4" />
        </Button>
      </div>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconTag className="size-3" />
            {t("sections.type_listings")}
          </span>
        }
      >
        <ToggleGroup
          type="single"
          value={values.listing_type || ""}
          onValueChange={(value) =>
            setValue("listing_type", (value as ListingType) || undefined)
          }
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

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconMapPin className="size-3" />
            {t("sections.location")}
          </span>
        }
      >
        <div className="space-y-2">
          <PlaceSearch
            lang={lang as "es" | "en"}
            navigate={false}
            placeholder={t("common:words.search") || "Ciudad o barrio..."}
            onSelect={(place: ParsedPlace) => {
              if (place.city) setValue("city", place.city);
              if (place.state) setValue("state", place.state);
              if (place.neighborhood)
                setValue("neighborhood", place.neighborhood);
            }}
          />
          {/* Mostrar chips de lo seleccionado */}
          {(values.city || values.state || values.neighborhood) && (
            <div className="flex flex-wrap gap-1.5">
              {values.state && typeof values.state === "string" && (
                <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {STATE_LABELS[values.state as keyof typeof STATE_LABELS] ??
                    values.state}
                  <button
                    type="button"
                    onClick={() => {
                      setValue("state", undefined);
                      setValue("city", undefined);
                    }}
                  >
                    <IconX className="size-2.5" />
                  </button>
                </span>
              )}
              {values.city && typeof values.city === "string" && (
                <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {CITY_LABELS[values.city as keyof typeof CITY_LABELS] ??
                    values.city}
                  <button
                    type="button"
                    onClick={() => setValue("city", undefined)}
                  >
                    <IconX className="size-2.5" />
                  </button>
                </span>
              )}
              {values.neighborhood && (
                <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {values.neighborhood}
                  <button
                    type="button"
                    onClick={() => setValue("neighborhood", undefined)}
                  >
                    <IconX className="size-2.5" />
                  </button>
                </span>
              )}
            </div>
          )}
          {/* Barrio manual como fallback */}
          <Form.Input
            name="neighborhood"
            placeholder={t("placeholders.neighborhood")}
          />
        </div>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconCurrencyDollar className="size-3" />
            {t("sections.price_range")}
          </span>
        }
      >
        <div className="space-y-2">
          <Slider
            value={[values.min_price || 0, values.max_price || 100000000]}
            onValueChange={([min, max]) => {
              setValue("min_price", min);
              setValue("max_price", max);
            }}
            max={100000000}
            step={1000000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${(priceRange[0] || 0).toLocaleString(i18n.language)}</span>
            <span>
              ${(priceRange[1] || 100000000).toLocaleString(i18n.language)}
            </span>
          </div>
        </div>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconHome className="size-3" />
            {t("sections.type_properties")}
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
              className="text-xs px-2 py-0.5 h-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconBed className="size-3" />
            {t("sections.rooms")}
          </span>
        }
      >
        <ToggleGroup
          type="single"
          value={String(values.min_bedrooms || "")}
          onValueChange={(value) =>
            setValue("min_bedrooms", value ? Number(value) : undefined)
          }
          className="flex gap-1"
        >
          {bedroomOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex-1 text-xs py-0.5 h-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconBath className="size-3" />
            {t("sections.bathrooms")}
          </span>
        }
      >
        <ToggleGroup
          type="single"
          value={String(values.min_bathrooms || "")}
          onValueChange={(value) =>
            setValue("min_bathrooms", value ? Number(value) : undefined)
          }
          className="flex gap-1"
        >
          {bathroomOptions.map((option) => (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              className="flex-1 text-xs py-0.5 h-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Form.Set>

      <Form.Set
        legend={
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <IconCheckbox className="size-3" />
            {t("sections.amenities")}
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 max-h-40 overflow-y-auto">
          {amenitiesOptions.map((amenity) => (
            <div key={amenity.value} className="flex items-center gap-1.5">
              <Checkbox
                id={`amenity-${amenity.value}`}
                className="size-3.5"
                checked={values.amenities?.includes(amenity.value)}
                onCheckedChange={(checked) => {
                  const current = values.amenities || [];
                  setValue(
                    "amenities",
                    checked
                      ? [...current, amenity.value]
                      : current.filter((a) => a !== amenity.value),
                  );
                }}
              />
              <label
                htmlFor={`amenity-${amenity.value}`}
                className="text-xs cursor-pointer"
              >
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </Form.Set>

      {values.amenities && values.amenities.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue("amenities", [])}
          className="w-full"
        >
          {t("actions.clear_amenities")}
        </Button>
      )}
    </Form>
  );
}
