"use client"
import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"

type FieldSliderProps = {
  value: number[]
  onChange?: (value: number[]) => void
  label?: string
  description?: string
}

export function SliderInput({ value, onChange, label, description }: FieldSliderProps) {
  const [sliderValue, setSliderValue] = useState(value)

  const handleValueChange = (val: number[]) => {
    setSliderValue(val)
    if (onChange) {
      onChange(val)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldTitle>{label || "Price Range"}</FieldTitle>
        <FieldDescription>
          {description} ($
          <span className="font-medium tabular-nums">{sliderValue[0]}</span> -{" "}
          <span className="font-medium tabular-nums">{sliderValue[1]}</span>).
        </FieldDescription>
        <Slider
          value={sliderValue}
          onValueChange={handleValueChange}
          max={1000}
          min={0}
          step={10}
          className="mt-2 w-full"
          aria-label="Price Range"
        />
      </Field>
    </div>
  )
}
