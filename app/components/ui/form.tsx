"use client"

import { ReactNode, useEffect, useState, useTransition } from "react"
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

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxValue,
  ComboboxChipsInput,
} from "@/components/ui/combobox"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn, formatCurrency, parseCurrency } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { es } from "react-day-picker/locale/es"

/* =========================
   ROOT
========================= */

const { t } = i18next

type City = { value: string; label: string }
type State = { value: string; label: string; cities: City[] }
type Country = { value: string; label: string; states: State[] }

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
    <FieldGroup>
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
    </FieldGroup>
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
  type?: React.HTMLInputTypeAttribute | "currency"
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
} & React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === "password"
  const isCurrency = type === "currency"

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
                onClick={() => setShowPassword((prev) => !prev)}
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

        if (isCurrency) {
          return (
            <Input
              {...props}
              value={formatCurrency(field.value)}
              onChange={(e) => {
                const raw = parseCurrency(e.target.value)
                field.onChange(raw)
              }}
              inputMode="numeric"
            />
          )
        }

        return <Input {...field} {...props} type={type} />
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

function CountryStateCityField({
  control,
  countryName,
  stateName,
  cityName,
  countries,
  label,
  description,
  orientation = "vertical",
}: {
  control: any
  countryName: string
  stateName: string
  cityName: string
  countries: Country[]
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
}) {
  const { field: countryField } = useController({
    name: countryName,
    control,
  })

  const { field: stateField } = useController({
    name: stateName,
    control,
  })

  const { field: cityField } = useController({
    name: cityName,
    control,
  })

  const countryObj = countries.find(c => c.value === countryField.value)
  const stateObj = countryObj?.states.find(s => s.value === stateField.value)

  return (
    <BaseField
      name={countryName}
      label={label}
      description={description}
      orientation={orientation}
      render={() => (
        <div className="w-full grid lg:grid-cols-3 gap-2">
          {/* COUNTRY */}
          <Select
            value={countryField.value || ""}
            onValueChange={(val) => {
              countryField.onChange(val)
              stateField.onChange("")
              cityField.onChange("")
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="País" />
            </SelectTrigger>

            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* STATE */}
          <Select
            value={stateField.value || ""}
            disabled={!countryObj}
            onValueChange={(val) => {
              stateField.onChange(val)
              cityField.onChange("")
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>

            <SelectContent>
              {countryObj?.states.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* CITY */}
          <Select
            value={cityField.value || ""}
            disabled={!stateObj}
            onValueChange={cityField.onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>

            <SelectContent>
              {stateObj?.cities.map(c => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
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
  options,
  onSearch,
  placeholder = "Buscar...",
  debounce = 300,
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  options?: { label: string; value: string }[]
  onSearch?: (q: string) => Promise<{ label: string; value: string }[]>
  placeholder?: string
  debounce?: number
}) {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, debounce)

  const [items, setItems] = useState(options || [])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open || !onSearch) return
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setItems([])
      return
    }

    let active = true

    const run = async () => {
      const result = await onSearch(debouncedQuery)

      if (!active) return

      startTransition(() => {
        setItems(result)
      })
    }

    run()

    return () => {
      active = false
    }
  }, [debouncedQuery, open, onSearch])

  return (
    <div data-invalid={fieldState.invalid || undefined}>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

      <div className="relative">
        <Command
          className="border rounded-lg"
          shouldFilter={false}
          onFocus={() => setOpen(true)}
        >
          <CommandInput
            value={query}
            placeholder={placeholder}
            onValueChange={(value) => {
              setQuery(value)
              setOpen(true)
            }}
            onBlur={() => {
              setTimeout(() => setOpen(false), 120)
            }}
          />

          {open && (
            <CommandList>

              {isPending && (
                <div className="px-3 py-2 text-sm opacity-60">
                  Buscando...
                </div>
              )}

              {!isPending && items.length === 0 && debouncedQuery.length >= 2 && (
                <CommandEmpty>
                  Sin resultados
                </CommandEmpty>
              )}

              <CommandGroup>
                {!isPending && items.length ? items.map(item => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      field.onChange(item.value) // ✅ SOLO AQUÍ
                      setQuery(item.label)
                      setOpen(false)
                    }}
                  >
                    {item.label}
                  </CommandItem>
                )) : null}
              </CommandGroup>

            </CommandList>
          )}
        </Command>
      </div>

      {description && (
        <p className="text-xs opacity-70 mt-1">{description}</p>
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
   COMBOBOX PRO (RHF + shadcn)
========================= */

type ComboOption = {
  label: string
  value: string
  disabled?: boolean
  group?: string
  raw?: any
}

function ComboboxField({
  name,
  label,
  description,
  orientation = "vertical",
  options = [],
  onSearch,
  multiple = false,
  disabled = false,
  placeholder = t("words.select"),
  searchPlaceholder = t("words.search"),
  debounce = 300,
  renderItem,
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  options?: ComboOption[]
  onSearch?: (query: string) => Promise<ComboOption[]>
  multiple?: boolean
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  debounce?: number
  renderItem?: (item: ComboOption, selected: boolean) => ReactNode
}) {
  const { control } = useFormContext()
  const { field, fieldState } = useController({ name, control })

  const [query, setQuery] = useState("")
  const debounced = useDebounce(query, debounce)

  const [items, setItems] = useState<ComboOption[]>(options)
  const [loading, setLoading] = useState(false)

  const value = multiple
    ? (field.value ?? []).map((v: any) =>
      options.find(o => o.value === v.value)
    ).filter(Boolean)
    : field.value
      ? options.find(o => o.value === field.value.value) ?? null
      : null

  const selectedValues = multiple
    ? value
    : value
      ? [value]
      : []

  useEffect(() => {
    if (!onSearch) {
      const q = debounced.toLowerCase()
      setItems(
        options.filter(o => o.label.toLowerCase().includes(q))
      )
      return
    }

    let ignore = false
    setLoading(true)

    onSearch(debounced).then(res => {
      if (!ignore) setItems(res)
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [debounced])

  const grouped = items.reduce<Record<string, ComboOption[]>>((acc, item) => {
    const g = item.group || "default"
    if (!acc[g]) acc[g] = []
    acc[g].push(item)
    return acc
  }, {})

  return (
    <Field orientation={orientation} data-invalid={fieldState.invalid || undefined}>
      {label && <FieldLabel>{label}</FieldLabel>}

      <FieldContent>
        <Combobox
          items={items}
          value={value}
          multiple={multiple}
          onValueChange={(val) => {
            if (multiple) {
              const mapped = (val as ComboOption[]).map(v => ({
                label: v.label,
                value: v.value,
              }))
              field.onChange(mapped)
            } else {
              const v = val as ComboOption | null
              field.onChange(v ? { label: v.label, value: v.value } : null)
            }
          }}
          disabled={disabled}
          itemToStringValue={(item: ComboOption) => item.value}
        >
          {multiple ? (
            <ComboboxChips>
              <ComboboxValue placeholder={placeholder}>
                {(selected: ComboOption[]) =>
                  selected.map(item => (
                    <ComboboxChip key={item.value}>
                      {item.label}
                    </ComboboxChip>
                  ))
                }
              </ComboboxValue>

              <ComboboxChipsInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
              />
            </ComboboxChips>
          ) : (
            <ComboboxInput
              value={query}
              disabled={disabled}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />
          )}

          <ComboboxContent>
            {loading && (
              <div className="p-2 text-sm opacity-70">
                {t("words.search")}...
              </div>
            )}

            {!loading && items.length === 0 && (
              <ComboboxEmpty>
                {t("words.without_results")}
              </ComboboxEmpty>
            )}

            <ComboboxList>
              {Object.entries(grouped).map(([group, groupItems]) => (
                <div key={group}>
                  {group !== "default" && (
                    <div className="px-3 py-1 text-xs opacity-60">
                      {group}
                    </div>
                  )}

                  {groupItems.map(item => {
                    const selected = selectedValues.includes(item.value)

                    return (
                      <ComboboxItem
                        key={item.value}
                        value={item}
                        disabled={item.disabled}
                      >
                        {renderItem
                          ? renderItem(item, selected)
                          : item.label}
                      </ComboboxItem>
                    )
                  })}
                </div>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>

        {description && <FieldDescription>{description}</FieldDescription>}

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
   DATE PICKER
========================= */

function DatePickerField({
  name,
  label,
  description,
  orientation = "vertical",
  placeholder = "Seleccionar fecha",
  disabled = false,
  fromYear,
  toYear,
}: {
  name: string
  label?: ReactNode
  description?: ReactNode
  orientation?: "vertical" | "horizontal" | "responsive"
  placeholder?: string
  disabled?: boolean
  fromYear?: number
  toYear?: number
}) {
  return (
    <BaseField
      name={name}
      label={label}
      description={description}
      orientation={orientation}
      render={(field) => {
        const value: Date | undefined =
          field.value ? new Date(field.value) : undefined

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {value
                  ? format(value, "PPP", { locale: es })
                  : placeholder}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => {
                  field.onChange(date ?? null)
                }}
                startMonth={fromYear ? new Date(fromYear, 0) : undefined}
                endMonth={toYear ? new Date(toYear, 11) : undefined}
              />
            </PopoverContent>
          </Popover>
        )
      }}
    />
  )
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
  CountryStateCity: CountryStateCityField,
  Url: UrlField,
  Autocomplete: AutocompleteField,
  Combobox: ComboboxField,
  Date: DatePickerField,
  Set,
  Array: ArrayField,
})
