import * as yup from "yup";
import { titleSchema } from "../base/title.schema";
import i18next from "i18next";
import { descriptionSchema } from "../base/description.schema";
import { propertyTypeSchema } from "../base/property_type.schema";
import { latitudeSchema } from "../base/latitude.schema";
import { longitudeSchema } from "../base/longitude.schema";
import { neighborhoodSchema } from "../base/neighborhood.schema";
import { bedroomsSchema } from "../base/bedrooms.schema";
import { bathroomsSchema } from "../base/bathrooms.schema";
import { builtAreaSchema } from "../base/built_area.schema";
import { lotAreaSchema } from "../base/lot_area.schema";
import { floorsSchema } from "../base/floors.schema";
import { yearBuiltSchema } from "../base/year_built.schema";
import { parkingSpotsSchema } from "../base/parking_spots.schema";
import { amenitiesSchema } from "../base/amenities.schema";
import { requiredAddressSchema } from "../base/address.schema";
/**
 * Schema de validación para importación de properties
 */
export const propertyImportSchema = yup
  .object({
    title: titleSchema.required(
      i18next.t("validations:required", { attribute: "title" }),
    ),
    description: descriptionSchema,
    property_type: propertyTypeSchema.required(
      i18next.t("validations:required", { attribute: "property_type" }),
    ),
    latitude: latitudeSchema.nullable(),
    longitude: longitudeSchema.nullable(),
    neighborhood: neighborhoodSchema.nullable(),
    bedrooms: bedroomsSchema.nullable(),
    bathrooms: bathroomsSchema.nullable(),
    built_area: builtAreaSchema.nullable(),
    lot_area: lotAreaSchema.nullable(),
    floors: floorsSchema.nullable(),
    year_built: yearBuiltSchema.nullable(),
    parking_spots: parkingSpotsSchema.nullable(),
    amenities: amenitiesSchema,
  })
  .concat(requiredAddressSchema);

export type PropertyImportInput = yup.InferType<typeof propertyImportSchema>;

export const propertyImportHeaders = [
  "title",
  "description",
  "property_type",
  "street",
  "city",
  "state",
  "postal_code",
  "country",
  "latitude",
  "longitude",
  "neighborhood",
  "bedrooms",
  "bathrooms",
  "built_area",
  "lot_area",
  "floors",
  "year_built",
  "parking_spots",
  "amenities",
] as const;

export type PropertyImportHeader = (typeof propertyImportHeaders)[number];

/**
 * Headers en español para plantillas de importación de properties
 */
export const propertyImportHeadersES = [
  "título",
  "descripción",
  "tipo_propiedad",
  "calle",
  "ciudad",
  "país",
  "estado",
  "latitud",
  "longitud",
  "barrio",
  "habitaciones",
  "baños",
  "área_construida",
  "área_lote",
  "pisos",
  "año_construcción",
  "parqueaderos",
  "código_postal",
  "amenities",
] as const;

export type PropertyImportHeaderES = (typeof propertyImportHeadersES)[number];
