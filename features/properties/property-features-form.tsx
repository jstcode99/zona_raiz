"use client";
import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { amenitiesOptions } from "@/domain/entities/property.entity";
import { Home, LucideIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

function SectionHeader({
  icon: Icon,
  legend,
}: {
  icon: LucideIcon;
  legend: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-md border border-border flex items-center justify-center bg-muted/40 shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
        {legend}
      </span>
    </div>
  );
}

function UnitInput({
  name,
  label,
  placeholder,
  unit,
  step,
}: {
  name: string;
  label: string;
  placeholder: string;
  unit?: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <Form.Input
          name={name}
          type="number"
          step={step}
          placeholder={placeholder}
          className={cn(unit && "pr-9")}
        />
        {unit && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground/60 pointer-events-none select-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function PropertyFeaturesForm() {
  const { t } = useTranslation("properties");

  return (
    <div className="space-y-8">
      {/* Características */}
      <section>
        <SectionHeader icon={Home} legend={t("sections.features")} />
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <UnitInput
              name="bedrooms"
              label={t("labels.bedrooms")}
              placeholder="3"
              unit="un."
            />
            <UnitInput
              name="bathrooms"
              label={t("labels.bathrooms")}
              placeholder="2"
              unit="un."
            />
            <UnitInput
              name="floors"
              label={t("labels.floors")}
              placeholder="1"
              unit="un."
            />
            <UnitInput
              name="year_built"
              label={t("labels.year_built")}
              placeholder="2020"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <UnitInput
              name="built_area"
              label={t("labels.built_area")}
              placeholder="100.00"
              unit="m²"
              step="0.01"
            />
            <UnitInput
              name="lot_area"
              label={t("labels.lot_area")}
              placeholder="200.00"
              unit="m²"
              step="0.01"
            />
            <UnitInput
              name="parking_spots"
              label={t("labels.parking_spots")}
              placeholder="1"
              unit="un."
            />
          </div>
        </div>
      </section>

      <hr className="border-border/50" />

      {/* Amenidades */}
      <section>
        <SectionHeader icon={Sparkles} legend={t("labels.amenities")} />
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <p className="text-xs text-muted-foreground mb-3">
            {t("placeholders.amenities")}
          </p>
          <Form.Combobox
            name="amenities"
            label=""
            placeholder={t("placeholders.amenities")}
            multiple={true}
            options={amenitiesOptions}
          />
        </div>
      </section>
    </div>
  );
}
