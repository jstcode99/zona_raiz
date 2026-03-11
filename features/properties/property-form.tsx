"use client";

import { ComponentProps, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { flatten, cn, generateSlug } from "@/lib/utils";
import { WizardRef, WizardTab, WizardTabs } from "@/components/ui/wizard-form";
import { PropertyCeoForm } from "./property-ceo-form";
import { PropertyLocationForm } from "./property-location-form";
import { PropertyFeaturesForm } from "./property-features-form";
import { defaultPropertyValues, PropertyInput, propertySchema } from "@/application/validation/property.schema";
import { createPropertyAction, updatePropertyAction } from "@/application/actions/property.action";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { useRouter } from "next/navigation";
import { useRoutes } from "@/i18n/client-router";

interface PropertyFormProps extends ComponentProps<"form"> {
  realEstateId: string;
  defaultValues?: PropertyInput;
  id?: string;
}

export function PropertyForm({
  className,
  realEstateId,
  defaultValues,
  id,
  ...props
}: PropertyFormProps) {
  const router = useRouter()
  const routes = useRoutes()

  const { t } = useTranslation('common');
  const isUpdateMode = Boolean(id);

  const stepFields = {
    ceo: ["title", "slug", "description", "property_type"],
    location: ["street", "city", "state", "postal_code", "country", "latitude", "longitude"],
    features: [
      "bedrooms",
      "bathrooms",
      "total_area",
      "built_area",
      "lot_area",
      "floors",
      "year_built",
      "parking_spots",
      "amenities"
    ],
  } as const

  const form = useForm<PropertyInput>({
    resolver: yupResolver(propertySchema),
    defaultValues: defaultValues || defaultPropertyValues,
    mode: "onTouched",
  });

  const wizardRef = useRef<WizardRef>(null)


  const {
    trigger,
    reset,
    setValue,
    control,
    setError
  } = form;

  // Auto-generar slug desde el título
  const title = useWatch({ control, name: "title" });
  const currentSlug = useWatch({ control, name: "slug" });

  useEffect(() => {
    if (title) {
      const slug = generateSlug(title);
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [title, currentSlug, isUpdateMode, setValue]);

  const mutation = useServerMutation<PropertyEntity>({
    action: (formData: FormData) => {
      if (isUpdateMode && id) {
        return updatePropertyAction(id, formData);
      }
      return createPropertyAction(realEstateId, formData);
    },
    setError,
    onSuccess: (result) => {
      if (result.success) {
        const property = result.data
        toast.success(t(`forms.property.${isUpdateMode ? "updated" : "created"}`))
        if (!isUpdateMode) reset()
        wizardRef.current?.complete()
        router.push(`${routes.property(property.id)}/images`)
      }
    },
    onError: (error) => {
      console.error("Property error:", error)
      toast.error(t("forms.property.error"))
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  async function handleValidSubmit(values: PropertyInput) {
    wizardRef.current?.setBusy(true)
    try {

      const formData = new FormData();
      const data = flatten(values, "", formData);

      // Asegurar que amenities se envíe como JSON string
      if (values.amenities) {
        data.set("amenities", JSON.stringify(values.amenities));
      }

      mutation.action(data);
    } finally {
      wizardRef.current?.setBusy(false)
    }
  }

  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 mx-auto space-y-8", className)}
    >
      <WizardTabs
        ref={wizardRef}
        onSubmit={form.handleSubmit(v => handleValidSubmit(form.getValues()))}
      >
        <WizardTab
          id="ceo"
          title="ceo"
          canNext={() => trigger(stepFields.ceo)}
        >
          <PropertyCeoForm />
        </WizardTab>

        <WizardTab
          id="location"
          title="Mapa"
          canNext={() => trigger(stepFields.location)}
        >
          <PropertyLocationForm />
        </WizardTab>

        <WizardTab
          id="features"
          title="Detalles"
          canNext={() => trigger(stepFields.features)}
        >
          <PropertyFeaturesForm />
        </WizardTab>
      </WizardTabs>
    </Form>
  );
}