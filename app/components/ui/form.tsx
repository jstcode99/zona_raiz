"use client"

import { ReactNode, useState } from "react"
import {
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
  useController,
  useFieldArray,
  UseFieldArrayReturn,
} from "react-hook-form"

/* =========================
   UI IMPORTS (shadcn)
========================= */

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
  FieldSet,
  FieldLegend,
  FieldGroup,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import { Eye, EyeClosed } from "lucide-react"

/* =========================
   ROOT
========================= */

type RootProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  onSubmit: (values: T) => void | Promise<void>
  children: ReactNode
  className?: string
}

function Root<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: RootProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  )
}

/* =========================
   BASE RHF FIELD
========================= */

function BaseField({
  name,
  label,
  description,
  orientation = "vertical",
  render,
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  render: (field: any) => ReactNode
}) {
  const { control } = useFormContext()

  const { field, fieldState } = useController({
    name,
    control,
  })

  return (
    <Field
      orientation={orientation}
      data-invalid={fieldState.invalid || undefined}
    >
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <FieldContent>
        {render(field)}

        {description && (
          <FieldDescription>{description}</FieldDescription>
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
}

/* =========================
   INPUT
========================= */

function InputField({
  name,
  type,
  ...props
}: {
  name: string
  type?: React.HTMLInputTypeAttribute
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
} & React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"

  return (
    <BaseField
      name={name}
      {...props}
      render={(field) => {
        if (isPassword) {
          return (
            <InputGroup>
              <InputGroupInput
                {...field}
                {...props}
                type={showPassword ? "text" : "password"}
              />

              <InputGroupAddon
                align="inline-end"
                className="cursor-pointer"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </InputGroupAddon>
            </InputGroup>
          )
        }

        return (
          <Input
            {...field}
            {...props}
            type={type}
          />
        )
      }}
    />
  )
}


/* =========================
   TEXTAREA
========================= */

function TextareaField({
  name,
  ...props
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
} & React.ComponentProps<typeof Textarea>) {
  return (
    <BaseField
      name={name}
      {...props}
      render={(field) => (
        <Textarea
          {...field}
          {...props}
        />
      )}
    />
  )
}

/* =========================
   SELECT
========================= */

function SelectField({
  name,
  options,
  placeholder,
  ...props
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  options: { label: string; value: string }[]
  placeholder?: string
}) {
  return (
    <BaseField
      name={name}
      {...props}
      render={(field) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}

/* =========================
   CHECKBOX
========================= */

function CheckboxField({
  name,
  label,
  ...props
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
}) {
  return (
    <BaseField
      name={name}
      {...props}
      render={(field) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          {label}
        </div>
      )}
    />
  )
}

/* =========================
   FIELDSET
========================= */

function Set({
  legend,
  children,
}: {
  legend?: ReactNode
  children: ReactNode
}) {
  return (
    <FieldSet>
      {legend && <FieldLegend>{legend}</FieldLegend>}
      <FieldGroup>{children}</FieldGroup>
    </FieldSet>
  )
}

/* =========================
   FIELD ARRAY
========================= */

function ArrayField({
  name,
  children,
}: {
  name: string
  children: (
    fieldArray: UseFieldArrayReturn<any>
  ) => ReactNode
}) {
  const { control } = useFormContext()

  const fieldArray = useFieldArray({
    control,
    name,
  })

  return <>{children(fieldArray)}</>
}

/* =========================
   EXPORT API
========================= */

export const Form = Object.assign(Root, {
  Input: InputField,
  Textarea: TextareaField,
  Select: SelectField,
  Checkbox: CheckboxField,
  Set,
  Array: ArrayField,
})
