import { PropertyType } from "@/domain/entities/property.enums";
import { ListingType } from "@/domain/entities/listing.enums";
import {
  IconHome,
  IconBuildingSkyscraper,
  IconTree,
  IconBuildingStore,
  IconBuilding,
} from "@tabler/icons-react";

export const PROPERTY_TYPES = [
  {
    value: PropertyType.Apartment,
    label: "hero.property_types.apartment",
    icon: IconBuildingSkyscraper,
  },
  {
    value: PropertyType.House,
    label: "hero.property_types.house",
    icon: IconHome,
  },
  {
    value: PropertyType.Land,
    label: "hero.property_types.land",
    icon: IconTree,
  },
  {
    value: PropertyType.Commercial,
    label: "hero.property_types.commercial",
    icon: IconBuildingStore,
  },
  {
    value: PropertyType.Office,
    label: "hero.property_types.office",
    icon: IconBuilding,
  },
];

export const LISTING_TYPES = [
  { value: ListingType.RENT, label: "hero.listing_types.rent" },
  { value: ListingType.SALE, label: "hero.listing_types.sale" },
];

// Tipos de propiedad que son terreno/lote (sin bedrooms/bathrooms)
export const LAND_TYPES = [PropertyType.Land];