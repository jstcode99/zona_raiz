"use client"

import { ComponentProps, startTransition, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import i18next from "i18next"

import {
  propertySchema,
  defaultPropertyValues,
} from "@/domain/entities/schemas/propertySchema"

import { Form } from "@/components/ui/form"
import { useServerMutation } from "@/shared/hooks/useServerMutation"
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
  ...props
}: ComponentProps<"form">) {
  return (
    <></>
    // <Form
    //   {...props}
    //   form={form}
    //   className={cn("py-6 px-6 max-w-4xl mx-auto space-y-8", className)}
    //   onSubmit={onSubmit}

    // >
    //   <div className="text-center space-y-2">
    //     <h1 className="text-2xl font-bold">{t("forms.property.title")}</h1>
    //     <p className="text-muted-foreground">{t("forms.property.subtitle")}</p>
    //   </div>

    //   <WizardTabs
    //     ref={wizardRef}
    //     onSubmit={() => onSubmit(getValues())}
    //   >
    //     <WizardTab
    //       id="characteristics"
    //       icon={LampDesk}
    //       title={t("forms.property.characteristics")}
    //       canNext={() => detailsComplete}
    //     >
    //       <PropertyDetailsForm
    //         isChange={() => setDetailsComplete(false)}
    //         onComplete={() => setDetailsComplete(true)}
    //       />
    //     </WizardTab>

    //     <WizardTab
    //       id="location"
    //       title={t("forms.property.location")}
    //       icon={LocationEditIcon}
    //       nextText={t("forms.property.submit")}

    //     >
    //       {mode === "map" ? (
    //         <PlaceSelectorGoogle
    //           onSelect={(vals: PropertyLocationFormData) => {
    //             updateFormValues(vals)
    //             setLocationComplete(true)
    //           }}
    //         />
    //       ) : (
    //         <PropertyLocationForm
    //           isChange={() => (false)}
    //           onComplete={() => (true)}
    //         />
    //       )}
    //       <Field>
    //         <Separator />
    //         <FieldLabel>{t("forms.property.manual_switch")}</FieldLabel>
    //         <FieldContent>
    //           <Switch
    //             checked={mode === "manual"}
    //             onCheckedChange={(checked) =>
    //               setMode(checked ? "manual" : "map")
    //             }
    //           />
    //         </FieldContent>
    //       </Field>
    //     </WizardTab>
    //   </WizardTabs>
    // </Form>
  )
}
