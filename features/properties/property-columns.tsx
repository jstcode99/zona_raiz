"use client"

import { BaseRow } from "@/components/ui/data-table"
import { PropertyEntity, propertyTypeLabels } from "@/domain/entities/property.entity"
import { type ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  IconDotsVertical, 
  IconMapPin, 
  IconBed, 
  IconBath, 
  IconRuler,
  IconCar,
  IconHome,
  IconBuilding,
  IconBuildingEstate,
  IconBuildingSkyscraper,
  IconTree,
  IconBriefcase,
  IconBuildingWarehouse
} from "@tabler/icons-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { PropertyType } from "@/domain/entities/property.enums"

export type PropertyRow = BaseRow & {
  created_at: string
} & PropertyEntity


export const propertyTypeIcons: Record<PropertyType, React.ReactNode> = {
  [PropertyType.House]: <IconHome className="size-4" />,
  [PropertyType.Apartment]: <IconBuilding className="size-4" />,
  [PropertyType.Condo]: <IconBuildingEstate className="size-4" />,
  [PropertyType.TownHouse]: <IconBuilding className="size-4" />,
  [PropertyType.Land]: <IconTree className="size-4" />,
  [PropertyType.Commercial]: <IconBuildingSkyscraper className="size-4" />,
  [PropertyType.Office]: <IconBriefcase className="size-4" />,
  [PropertyType.Warehouse]: <IconBuildingWarehouse className="size-4" />,
  [PropertyType.Other]: <IconHome className="size-4" />,
}

export const PropertyColumns: ColumnDef<PropertyRow>[] = [
  {
    accessorKey: "title",
    header: "Propiedad",
    cell: ({ row }) => {
      const type = row.original.property_type
      return (
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            {propertyTypeIcons[type]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate max-w-[200px]">
              {row.original.title}
            </span>
            <span className="text-xs text-muted-foreground">
              {propertyTypeLabels[type]}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    id: "location",
    header: "Ubicación",
    cell: ({ row }) => {
      const { city, state, neighborhood, postal_code, address } = row.original
      return (
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-sm">
            <IconMapPin className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {neighborhood ? `${neighborhood}, ` : ""}
              {city}
            </span>
          </div>
          <span className="text-xs text-muted-foreground pl-5 truncate max-w-[180px]">
            {state} {postal_code && `(${postal_code})`}
          </span>
          {address && (
            <span 
              className="text-xs text-muted-foreground/70 pl-5 truncate max-w-[180px]"
              title={address}
            >
              {address}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "coords",
    header: "Coordenadas",
    cell: ({ row }) => {
      const { latitude, longitude } = row.original
      if (!latitude || !longitude) return (
        <span className="text-xs text-muted-foreground italic">Sin ubicación</span>
      )
      return (
        <div className="flex flex-col text-xs text-muted-foreground font-mono">
          <span>Lat: {latitude.toFixed(6)}</span>
          <span>Lng: {longitude.toFixed(6)}</span>
        </div>
      )
    },
  },
  {
    id: "features",
    header: "Características",
    cell: ({ row }) => {
      const { bedrooms, bathrooms, built_area, total_area, floors, parking_spots } = row.original
      
      const features = []
      if (bedrooms !== null) features.push({ icon: IconBed, value: `${bedrooms} hab.` })
      if (bathrooms !== null) features.push({ icon: IconBath, value: `${bathrooms} baños` })
      if (built_area !== null) features.push({ icon: IconRuler, value: `${built_area}m²` })
      else if (total_area !== null) features.push({ icon: IconRuler, value: `${total_area}m² tot.` })
      if (parking_spots !== null) features.push({ icon: IconCar, value: `${parking_spots} est.` })
      
      if (features.length === 0) return <span className="text-xs text-muted-foreground">—</span>
      
      return (
        <div className="flex flex-wrap gap-2">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
            >
              <feature.icon className="size-3.5" />
              <span>{feature.value}</span>
            </div>
          ))}
          {floors !== null && floors > 1 && (
            <span className="text-xs text-muted-foreground">• {floors} pisos</span>
          )}
        </div>
      )
    },
  },
  {
    id: "lot_info",
    header: "Terreno",
    cell: ({ row }) => {
      const { lot_area, year_built } = row.original
      if (!lot_area && !year_built) return <span className="text-xs text-muted-foreground">—</span>
      
      return (
        <div className="flex flex-col text-xs">
          {lot_area !== null && (
            <span className="text-muted-foreground">
              {lot_area}m² terreno
            </span>
          )}
          {year_built !== null && (
            <span className="text-muted-foreground">
              Año {year_built}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "amenities",
    header: "Amenidades",
    cell: ({ row }) => {
      const amenities = row.original.amenities || []
      if (amenities.length === 0) return <span className="text-xs text-muted-foreground">—</span>
      
      const display = amenities.slice(0, 2)
      const remaining = amenities.length - 2
      
      return (
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {display.map((amenity) => (
            <Badge key={amenity.value} variant="secondary" className="text-xs font-normal">
              {amenity.label}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{remaining}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Registro",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at)
      const updated = new Date(row.original.updated_at)
      const isUpdated = updated.getTime() !== date.getTime()
      
      return (
        <div className="flex flex-col text-xs">
          <span>{date.toLocaleDateString("es-ES")}</span>
          {isUpdated && (
            <span className="text-muted-foreground">
              Edit: {updated.toLocaleDateString("es-ES")}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const { latitude, longitude, id } = row.original
      const hasCoords = latitude && longitude
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical className="size-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <Link href={`/dashboard/properties/${id}`} passHref>
              <DropdownMenuItem>Editar propiedad</DropdownMenuItem>
            </Link>
            
            {hasCoords ? (
              <DropdownMenuItem asChild>
                <a 
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en mapa
                </a>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuSeparator />
            
            <DropdownMenuItem variant="destructive">
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]