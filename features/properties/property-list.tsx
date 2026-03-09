"use client"

import { PropertyRow } from "./property-columns"
import { Fragment, use } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PropertyCard } from "./property-card"
import { Separator } from "@/components/ui/separator"

interface Props {
    properties: Promise<PropertyRow[]>
}

export default function PropertiesList({
    properties,
}: Props) {
    const allProperties = use(properties)

    return (
        <ScrollArea className="h-72 w-48 rounded-md border">
            {allProperties.map((property) => (
                <Fragment key={property.id}>
                    <PropertyCard property={property} images={[]} />
                    <Separator className="my-2" />
                </Fragment>
            ))}
        </ScrollArea>
    )
}