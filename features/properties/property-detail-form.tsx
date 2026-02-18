"use client"

import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import i18next from "i18next"

import { isPropertyDetailsComplete } from "@/domain/entities/schemas/property"
import { Form } from "@/components/ui/form"
import { FieldLabel } from "@/components/ui/field"
import { Bath, Bed, Maximize } from "lucide-react"

export function PropertyDetailsForm({
  isChange,
  onComplete,
}: {
  isChange: () => void
  onComplete: () => void
}) {
  const t = i18next.t
  const { getValues } = useFormContext()
  const [isComplete, setIsComplete] = useState(false)

  const watched = useWatch({
    name: ["bedrooms", "bathrooms", "area_m2"],
  })

  useEffect(() => {
    const values = getValues()

    isPropertyDetailsComplete(values).then((complete) => {
      if (complete && !isComplete) {
        setIsComplete(true)
        onComplete()
      }

      if (!complete && isComplete) {
        setIsComplete(false)
        isChange()
      }
    })
  }, [watched])

  return (
    <Form.Set legend="Características de la propiedad">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Form.Input
          name="bedrooms"
          type="number"
          label={
            <FieldLabel htmlFor="bedrooms">
              <Bed className="size-4" />
              {t("forms.property.fields.bedrooms.label")}
            </FieldLabel>
          }
        />

        <Form.Input
          name="bathrooms"
          type="number"
          label={
            <FieldLabel htmlFor="bathrooms">
              <Bath className="size-4" />
              {t("forms.property.fields.bathrooms.label")}
            </FieldLabel>
          }
        />

        <Form.Input
          name="area_m2"
          type="number"
          label={
            <FieldLabel htmlFor="area_m2">
              <Maximize className="size-4" />
              {t("forms.property.fields.area_m2.label")}
            </FieldLabel>
          }
        />
      </div>
    </Form.Set>
  )
}
