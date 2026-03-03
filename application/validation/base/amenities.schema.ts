import * as yup from 'yup'

export const amenitiesSchema = yup
    .array()
    .of(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch {
          return [];
        }
      }
      return value;
    })
    .default([])