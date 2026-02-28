"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { defaultPropertyImageValues, PropertyImageInput, propertyImageSchema } from "@/application/validation/property-image.validation"

export function usePropertyImagesForm(defaultValues?: PropertyImageInput) {
  return useForm({
    resolver: yupResolver(propertyImageSchema),
    defaultValues: {
      ...defaultPropertyImageValues,
      ...defaultValues
    }
  })
}

