"use client"

import { ComponentProps, startTransition, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import i18next from "i18next"

import {
  propertySchema,
  defaultPropertyValues,
  type PropertyFormData,
  type PropertyLocationFormData,
} from "@/domain/entities/schemas/property"

import { Form } from "@/components/ui/form"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
import { createPropertyAction } from "@/application/actions/createPropertyAction"
import { updatePropertyAction } from "@/application/actions/updatePropertyAction"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { WizardRef, WizardTab, WizardTabs } from "@/components/ui/wizard-form"
import { LampDesk, LocationEditIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PlaceSelectorGoogle } from "../places/place-selector-google"
import { PropertyLocationForm } from "./property-location-form"
import { PropertyDetailsForm } from "./property-detail-form"

export function PropertyForm({
  className,
  defaultValues,
  id,
  ...props
}: ComponentProps<"form"> & { defaultValues?: PropertyFormData; id?: string }) {
  const t = i18next.t

  const [mode, setMode] = useState<"manual" | "map">("map")
  const [detailsComplete, setDetailsComplete] = useState(false)
  const wizardRef = useRef<WizardRef>(null)

  const form = useForm<PropertyFormData>({
    resolver: yupResolver(propertySchema),
    defaultValues: defaultValues ?? defaultPropertyValues,
    shouldUnregister: false,
    mode: "onBlur",
  })

  const { setValue, getValues } = form

  useEffect(() => {
    if (defaultValues) form.reset(defaultValues)
  }, [defaultValues])

  const create = useServerMutation({
    action: createPropertyAction,
    initialState: { success: false },
    onSuccess: () => {
      wizardRef.current?.complete()
      wizardRef.current?.setBusy(false)
    },

    setError: () => {
      wizardRef.current?.setBusy(false)
      form.setError
    }
  })

  const update = useServerMutation({
    action: updatePropertyAction,
    initialState: { success: false },
    onSuccess: () => {
      wizardRef.current?.complete()
      wizardRef.current?.setBusy(false)
    },
    setError: () => {
      wizardRef.current?.setBusy(false)
      form.setError
    }
  })

  const updateFormValues = (values: Partial<PropertyFormData>) => {
    Object.entries(values).forEach(([k, v]) =>
      setValue(k as keyof PropertyFormData, v as any, { shouldValidate: true })
    )
  }

  const onSubmit = (values: PropertyFormData) => {
    wizardRef.current?.setBusy(true)
    const formData = new FormData()

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value ?? ""))
    })

    startTransition(() => {
      if (id?.trim()) {
        formData.append("id", id)
        update.action(formData)
      } else {
        create.action(formData)
      }
    })
  }


  return (
    <Form
      {...props}
      form={form}
      className={cn("py-6 px-6 max-w-4xl mx-auto space-y-8", className)}
      onSubmit={onSubmit}

    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{t("forms.property.title")}</h1>
        <p className="text-muted-foreground">{t("forms.property.subtitle")}</p>
      </div>

      <WizardTabs
        ref={wizardRef}
        onSubmit={() => onSubmit(getValues())}
      >
        <WizardTab
          id="characteristics"
          icon={LampDesk}
          title={t("forms.property.characteristics")}
          canNext={() => detailsComplete}
        >
          <PropertyDetailsForm
            isChange={() => setDetailsComplete(false)}
            onComplete={() => setDetailsComplete(true)}
          />
        </WizardTab>

        <WizardTab
          id="location"
          title={t("forms.property.location")}
          icon={LocationEditIcon}
          nextText={t("forms.property.submit")}

        >
          {mode === "map" ? (
            <PlaceSelectorGoogle
              onSelect={(vals: PropertyLocationFormData) => {
                updateFormValues(vals)
                setLocationComplete(true)
              }}
            />
          ) : (
            <PropertyLocationForm
              isChange={() => (false)}
              onComplete={() => (true)}
            />
          )}
          <Field>
            <Separator />
            <FieldLabel>{t("forms.property.manual_switch")}</FieldLabel>
            <FieldContent>
              <Switch
                checked={mode === "manual"}
                onCheckedChange={(checked) =>
                  setMode(checked ? "manual" : "map")
                }
              />
            </FieldContent>
          </Field>
        </WizardTab>
      </WizardTabs>
    </Form>
  )
}
