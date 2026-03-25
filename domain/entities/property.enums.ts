export enum PropertyType {
  House = "house",
  Apartment = "apartment",
  Condo = "condo",
  TownHouse = "townhouse",
  Land = "land",
  Commercial = "commercial",
  Office = "office",
  Warehouse = "warehouse",
  Other = "other",
}
export const propertyTypeValues: string[] = Object.values(PropertyType);

export enum AmenitiesType {
  Pool = "pool",
  Gym = "gym",
  Parking = "parking",
  Elevator = "elevator",
  Security = "security",
  Garden = "garden",
  Balcony = "balcony",
  AirConditioning = "air_conditioning",
  Heating = "heating",
}
