"use client";

import { ComponentProps, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  defaultPropertyValues,
  propertySchema,
  type PropertyFormValues,
} from "@/domain/entities/schemas/property.schema";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { flatten, cn, generateSlug } from "@/lib/utils";
import { PropertyType } from "@/domain/entities/property.entity";
import { createPropertyAction, updatePropertyAction } from "@/domain/adapters/http/property.action";

interface PropertyFormProps extends ComponentProps<"form"> {
  realEstateId: string;
  defaultValues?: PropertyFormValues;
  id?: string;
}

export function PropertyForm({
  className,
  realEstateId,
  defaultValues,
  id,
  ...props
}: PropertyFormProps) {
  const { t } = useTranslation();
  const isUpdateMode = Boolean(id);

  const form = useForm<PropertyFormValues>({
    resolver: yupResolver(propertySchema),
    defaultValues: defaultValues || defaultPropertyValues,
    mode: "onBlur",
  });

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting, isDirty },
  } = form;

  // Auto-generar slug desde el título
  const title = useWatch({ control, name: "title" });
  const currentSlug = useWatch({ control, name: "slug" });

  useEffect(() => {
    if (!isUpdateMode && title && !currentSlug) {
      const slug = generateSlug(title);
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [title, currentSlug, isUpdateMode, setValue]);

  const mutation = useServerMutation({
    action: (formData: FormData) => {
      if (isUpdateMode && id) {
        return updatePropertyAction(id, formData);
      }
      return createPropertyAction(realEstateId, formData);
    },
    setError: form.setError,
    onSuccess: () => {
      toast.success(t(`forms.property.${isUpdateMode ? 'updated' : 'created'}`));
      if (!isUpdateMode) reset();
    },
    onError: (error) => {
      console.error("Property error:", error);
      toast.error(t("forms.property.error"));
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    const data = flatten(values, "", formData);
    
    // Asegurar que amenities se envíe como JSON string
    if (values.amenities) {
      data.set("amenities", JSON.stringify(values.amenities));
    }
    
    mutation.action(data);
  });

  const isLoading = isSubmitting || mutation.isPending;

  const propertyTypeOptions = Object.values(PropertyType).map((type) => ({
    value: type,
    label: t(`forms.property.fields.property_type.options.${type}`),
  }));

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 mx-auto space-y-8", className)}
      onSubmit={onSubmit}
    >
      {/* Información Básica */}
      <Form.Set legend={t("forms.property.basic-info")}>
        <Form.Input
          name="title"
          label={t("forms.property.fields.title.label")}
          placeholder={t("forms.property.fields.title.placeholder")}
          disabled={isLoading}
        />
        
        <Form.Input
          name="slug"
          label={t("forms.property.fields.slug.label")}
          placeholder={t("forms.property.fields.slug.placeholder")}
          disabled={isLoading || isUpdateMode}
        />
        
        <Form.Select
          name="property_type"
          label={t("forms.property.fields.property_type.label")}
          options={propertyTypeOptions}
        />
        
        <Form.Textarea
          name="description"
          label={t("forms.property.fields.description.label")}
          placeholder={t("forms.property.fields.description.placeholder")}
          disabled={isLoading}
          rows={4}
        />
      </Form.Set>

      {/* Ubicación */}
      <Form.Set legend={t("forms.property.location")}>
        <Form.Input
          name="address"
          label={t("forms.property.fields.address.label")}
          placeholder={t("forms.property.fields.address.placeholder")}
          disabled={isLoading}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Form.Input
            name="street"
            label={t("forms.property.fields.street.label")}
            placeholder={t("forms.property.fields.street.placeholder")}
            disabled={isLoading}
          />
          <Form.Input
            name="neighborhood"
            label={t("forms.property.fields.neighborhood.label")}
            placeholder={t("forms.property.fields.neighborhood.placeholder")}
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Form.Input
            name="city"
            label={t("forms.property.fields.city.label")}
            placeholder={t("forms.property.fields.city.placeholder")}
            disabled={isLoading}
            required
          />
          <Form.Input
            name="state"
            label={t("forms.property.fields.state.label")}
            placeholder={t("forms.property.fields.state.placeholder")}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Form.Input
            name="postal_code"
            label={t("forms.property.fields.postal_code.label")}
            placeholder={t("forms.property.fields.postal_code.placeholder")}
            disabled={isLoading}
          />
          <Form.Input
            name="country"
            label={t("forms.property.fields.country.label")}
            placeholder={t("forms.property.fields.country.placeholder")}
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Form.Input
            name="latitude"
            type="number"
            step="any"
            label={t("forms.property.fields.latitude.label")}
            placeholder={t("forms.property.fields.latitude.placeholder")}
            disabled={isLoading}
          />
          <Form.Input
            name="longitude"
            type="number"
            step="any"
            label={t("forms.property.fields.longitude.label")}
            placeholder={t("forms.property.fields.longitude.placeholder")}
            disabled={isLoading}
          />
        </div>
      </Form.Set>

      {/* Características */}
      <Form.Set legend={t("forms.property.features")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Form.Input
            name="bedrooms"
            type="number"
            label={t("forms.property.fields.bedrooms.label")}
            placeholder="3"
            disabled={isLoading}
          />
          <Form.Input
            name="bathrooms"
            type="number"
            label={t("forms.property.fields.bathrooms.label")}
            placeholder="2"
            disabled={isLoading}
          />
          <Form.Input
            name="floors"
            type="number"
            label={t("forms.property.fields.floors.label")}
            placeholder="1"
            disabled={isLoading}
          />
          <Form.Input
            name="year_built"
            type="number"
            label={t("forms.property.fields.year_built.label")}
            placeholder="2020"
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Form.Input
            name="total_area"
            type="number"
            step="0.01"
            label={t("forms.property.fields.total_area.label")}
            placeholder="120.50"
            disabled={isLoading}
          />
          <Form.Input
            name="built_area"
            type="number"
            step="0.01"
            label={t("forms.property.fields.built_area.label")}
            placeholder="100.00"
            disabled={isLoading}
          />
          <Form.Input
            name="lot_area"
            type="number"
            step="0.01"
            label={t("forms.property.fields.lot_area.label")}
            placeholder="200.00"
            disabled={isLoading}
          />
          <Form.Input
            name="parking_spots"
            type="number"
            label={t("forms.property.fields.parking_spots.label")}
            placeholder="1"
            disabled={isLoading}
          />
        </div>
      </Form.Set>

      {/* Amenities */}
      <Form.Set legend={t("forms.property.amenities")}>
        <Form.Combobox
          name="amenities"
          label={t("forms.property.fields.amenities.label")}
          placeholder={t("forms.property.fields.amenities.placeholder")}
          disabled={isLoading}
          options={[
            {label: "Piscina", value: "Piscina"},
            {label: "Gimnasio", value: "Gimnasio"},
            {label: "Seguridad", value: "Seguridad"},
            {label: "Estacionamiento", value: "Estacionamiento"},
            {label: "Jardín", value: "Jardín"},
            {label: "Terraza", value: "Terraza"},
            {label: "Ascensor", value: "Ascensor"},
            {label: "Aire acondicionado", value: " acondiciona"},
            {label: "Calefacción", value: "Calefacción"},
            {label: "Amueblado", value: "Amueblado"},
          ]}
        />
      </Form.Set>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !isDirty}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
        {id ? t("forms.property.update") : t("forms.property.create")}
      </Button>
    </Form>
  );
}