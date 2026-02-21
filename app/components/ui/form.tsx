"use client"

import { ReactNode, useEffect, useState } from "react"
import {
  FieldValues,
  FormProvider,
  UseFormReturn,
  useFormContext,
  useController,
  useFieldArray,
  UseFieldArrayReturn,
} from "react-hook-form"
import i18next from "i18next"

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
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
/* =========================
   ROOT
========================= */

const { t } = i18next

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
   URL
========================= */

function UrlField({
  name,
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
        <Input
          {...field}
          inputMode="url"
          placeholder="https://..."
          onBlur={(e) => {
            let v = e.target.value.trim()
            if (v && !/^https?:\/\//i.test(v)) {
              v = "https://" + v
            }
            field.onChange(v)
          }}
        />
      )}
    />
  )
}

/* =========================
   ADDRESS
========================= */

function AddressField({
  name,
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
      render={(field) => {
        const value = field.value || {}
        const set = (k: string, v: string) =>
          field.onChange({ ...value, [k]: v })

        return (
          <div className="grid gap-3">
            <Input
              placeholder={t("words.street")}
              value={value.street || ""}
              onChange={(e) => set("street", e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder={t("words.city")}
                value={value.city || ""}
                onChange={(e) => set("city", e.target.value)}
              />
              <Input
                placeholder={t("words.state")}
                value={value.state || ""}
                onChange={(e) => set("state", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder={t("words.postal_code")}
                value={value.postal_code || ""}
                onChange={(e) => set("postal_code", e.target.value)}
              />
              <Input
                placeholder={t("words.country")}
                value={value.country || ""}
                onChange={(e) => set("country", e.target.value)}
              />
            </div>
          </div>
        )
      }}
    />
  )
}

/* =========================
   FILE DROP
========================= */

function FileDropField({
  name,
  multiple = false,
  accept,
  ...props
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  multiple?: boolean
  accept?: string
}) {
  return (
    <BaseField
      name={name}
      {...props}
      render={(field) => {
        const handleFiles = (files: FileList | null) => {
          if (!files) return
          field.onChange(multiple ? Array.from(files) : files[0])
        }

        return (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFiles(e.dataTransfer.files)
            }}
            className="border border-dashed rounded-xl p-6 text-center cursor-pointer"
            onClick={() => document.getElementById(name)?.click()}
          >
            <input
              id={name}
              type="file"
              className="hidden"
              multiple={multiple}
              accept={accept}
              onChange={(e) => handleFiles(e.target.files)}
            />

            <p className="text-sm opacity-70">
              {t("words.drop_file")}
            </p>

            {field.value && (
              <p className="text-xs mt-2">
                {multiple
                  ? `${field.value.length} ${t("words.drop_file")}`
                  : field.value.name}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}

/* =========================
   AUTOCOMPLETE (Command)
========================= */



function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

function AutocompleteField({
  name,
  label,
  description,
  orientation = "vertical",
  options,
  onSearch,
  placeholder = "Buscar...",
  debounce = 300,
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  options?: { label: string; value: string }[]
  onSearch?: (q: string) => Promise<{ label: string; value: string }[]>
  placeholder?: string
  debounce?: number
}) {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(field.value || "")
  const debouncedQuery = useDebounce(query, debounce)

  const [items, setItems] = useState(options || [])
  const [loading, setLoading] = useState(false)

  const isAsync = !!onSearch

  useEffect(() => {
    let ignore = false

    const run = async () => {
      if (!open) return

      if (isAsync && onSearch) {
        setLoading(true)
        const result = await onSearch(debouncedQuery)
        if (!ignore) setItems(result)
        setLoading(false)
        return
      }

      if (options) {
        setItems(
          options.filter(o =>
            o.label.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
        )
      }
    }

    run()
    return () => {
      ignore = true
    }
  }, [debouncedQuery, open])

  return (
    <div data-invalid={fieldState.invalid || undefined}>
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        <Command
          className="border rounded-lg"
          shouldFilter={false} // filtramos nosotros
          onFocus={() => setOpen(true)}
        >
          <CommandInput
            value={query}
            placeholder={placeholder}
            onValueChange={(value) => {
              setQuery(value)
              field.onChange(value)
              setOpen(true)
            }}
            onBlur={() => {
              // pequeño delay para permitir click en item
              setTimeout(() => setOpen(false), 120)
            }}
          />

          {open && (
            <CommandList>
              {loading && (
                <div className="px-3 py-2 text-sm opacity-60">
                  {t('words.search')}...
                </div>
              )}

              {!loading && items.length === 0 && (
                <CommandEmpty>
                 {t('words.without_results')}...
                </CommandEmpty>
              )}

              <CommandGroup>
                {items.map(item => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      field.onChange(item.value)
                      setQuery(item.label)
                      setOpen(false)
                    }}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>

      {description && (
        <p className="text-xs opacity-70 mt-1">
          {description}
        </p>
      )}

      {fieldState.error && (
        <p className="text-xs text-red-500 mt-1">
          {fieldState.error.message}
        </p>
      )}
    </div>
  )
}


/* =========================
   PHONE
========================= */

type CountryOption = {
  code: string      // US, ES, MX...
  dial: string      // +1, +34...
  label: string
}

const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: "COL", dial: "+57", label: "Colombia" },
  { code: "US", dial: "+1", label: "United States" },
  { code: "ES", dial: "+34", label: "España" },
  { code: "MX", dial: "+52", label: "México" },
  { code: "AR", dial: "+54", label: "Argentina" },
]

function guessCountry(countries: CountryOption[]) {
  if (typeof navigator === "undefined") return countries[0]
  const lang = navigator.language?.toUpperCase() || ""
  const match = countries.find(c => lang.includes(c.code))
  return match || countries[0]
}

function PhoneField({
  name,
  countries = DEFAULT_COUNTRIES,
  autoDetect = true,
  placeholder = "Número",
  ...props
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  countries?: CountryOption[]
  autoDetect?: boolean
  placeholder?: string
}) {
  return (
    <BaseField
      name={name}
      {...props}
      render={(field) => {
        const initial = autoDetect && !field.value
          ? `${guessCountry(countries).dial} `
          : field.value || ""

        return (
          <InputGroup>
            <Select
              value={(field.value || initial).split(" ")[0]}
              onValueChange={(dial) => {
                const number = (field.value || "").split(" ").slice(1).join(" ")
                field.onChange(`${dial} ${number}`.trim())
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map(c => (
                  <SelectItem key={c.code} value={c.dial}>
                    {c.label} {c.dial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <InputGroupInput
              value={(field.value || initial).split(" ").slice(1).join(" ")}
              onChange={(e) => {
                const dial = (field.value || initial).split(" ")[0]
                field.onChange(`${dial} ${e.target.value}`)
              }}
              placeholder={placeholder}
              inputMode="tel"
            />
          </InputGroup>
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
          <SelectTrigger className="w-full">
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
  ...props
}: {
  legend?: ReactNode
  children: ReactNode
} & React.ComponentProps<"fieldset">) {
  return (
    <FieldSet {...props}>
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
  Phone: PhoneField,
  File: FileDropField,
  Address: AddressField,
  Url: UrlField,
  Autocomplete: AutocompleteField,
  Set,
  Array: ArrayField,
})
