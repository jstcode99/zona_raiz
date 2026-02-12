"use client"

import { ReactNode } from "react"
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "@/components/ui/field"

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  name: TName
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  render: (field: any) => ReactNode
}

export function RHFField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  orientation = "vertical",
  render,
}: Props<TFieldValues, TName>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = !!fieldState.error

        return (
          <Field
            orientation={orientation}
            data-invalid={isInvalid || undefined}
          >
            {label && (
              <FieldLabel htmlFor={name}>
                {label}
              </FieldLabel>
            )}

            <FieldContent>
              {render(field)}

              {description && (
                <FieldDescription>
                  {description}
                </FieldDescription>
              )}

              <FieldError
                errors={
                  fieldState.error
                    ? [{ message: fieldState.error.message }]
                    : undefined
                }
              />
            </FieldContent>
          </Field>
        )
      }}
    />
  )
}
