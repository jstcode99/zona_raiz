"use client"

import { useEffect, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import i18next from "i18next"
import departments from "@/domain/entities/json/department.json"

import { isPropertyLocationComplete } from "@/domain/entities/schemas/property"
import { Form } from "@/components/ui/form"

export function PropertyLocationForm({
  isChange,
  onComplete,
}: {
  isChange: () => void
  onComplete: () => void
}) {
  const t = i18next.t
  const { getValues, setValue } = useFormContext()
  const [isComplete, setIsComplete] = useState(false)

  const watched = useWatch({
    name: [
      "address",
      "neighborhood",
      "city",
      "state",
      "country",
      "latitude",
      "longitude",
      "google_maps_url",
    ],
  })

  useEffect(() => {
    const values = getValues()

    isPropertyLocationComplete(values).then((complete) => {
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

  const selectedDepartment = useWatch({ name: "state" })

  const cityOptions = useMemo(() => {
    return departments.find((d) => d.value === selectedDepartment)?.cities ?? []
  }, [selectedDepartment])

  useEffect(() => {
    setValue("city", "")
  }, [selectedDepartment])

  return (
    <Form.Set legend="Ubicación de la propiedad">
      <Form.Input
        name="address"
        label={t("forms.property.fields.address.label")}
        placeholder={t("forms.property.fields.address.placeholder")}
      />
      <Form.Input
        name="neighborhood"
        label={t("forms.property.fields.neighborhood.label")}
        placeholder={t("forms.property.fields.neighborhood.placeholder")}
      />

      <Form.Select
        name="country"
        label={t("forms.property.fields.country.label")}
        placeholder={t("forms.property.fields.country.placeholder")}
        options={[{ value: "colombia", label: "Colombia" }]}
      />

      <Form.Select
        name="state"
        label={t("forms.property.fields.state.label")}
        placeholder={t("forms.property.fields.state.placeholder")}
        options={departments.map(({ value, label }) => ({ value, label }))}
      />

      <Form.Select
        name="city"
        label={t("forms.property.fields.city.label")}
        placeholder={t("forms.property.fields.city.placeholder")}
        options={cityOptions}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Input
          name="latitude"
          label={t("forms.property.fields.latitude.label")}
          placeholder={t("forms.property.fields.latitude.placeholder")}

        />
        <Form.Input
          name="longitude"
          label={t("forms.property.fields.longitude.label")}
          placeholder={t("forms.property.fields.longitude.placeholder")}
        />
      </div>

      <Form.Input
        name="google_maps_url"
        label={t("forms.property.fields.google_maps_url.label")}
        placeholder={t("forms.property.fields.google_maps_url.placeholder")}
      />
    </Form.Set>
  )
}
