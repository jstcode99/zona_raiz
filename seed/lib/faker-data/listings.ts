// ==========================================
// Listings Generator for Seed
// ==========================================

import { faker } from "@faker-js/faker";
import type { SeedListing } from "../../types";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";
import { currencyOptions } from "@/domain/entities/currency.enums";
import { listingTypeOptions } from "@/domain/entities/listing.entity";

/**
 * Genera listados fake.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateFakeListings(
  count: number,
  properties: any[],
  whatsappContact: string,
): SeedListing[] {
  if (properties.length === 0) return [];

  return Array.from({ length: count }, (_, i) => {
    const property = properties[i % properties.length];
    const id = faker.string.uuid();
    const listingType = faker.helpers.arrayElement(
      listingTypeOptions.map((v) => v.value),
    );
    const price = faker.number.int({ min: 50000, max: 1000000 });
    const currency = faker.helpers.arrayElement(
      currencyOptions.map((v) => v.value),
    );
    const priceNegotiable = faker.datatype.boolean();
    const expensesAmount = faker.number.int({ min: 5000, max: 100000 });
    const expensesIncluded = faker.datatype.boolean();

    const status = faker.helpers.weightedArrayElement([
      { value: ListingStatus.ACTIVE, weight: 70 },
      { value: ListingStatus.DRAFT, weight: 10 },
    ]);

    const featured = faker.datatype.boolean({ probability: 0.2 });

    const featuredUntil = faker.datatype.boolean({ probability: 0.2 })
      ? faker.date.future({ years: 0.5 }).toISOString()
      : undefined;

    const viewsCount = faker.number.int({ min: 0, max: 1000 });
    const enquiriesCount = faker.number.int({ min: 0, max: 50 });
    const whatsappClicks = faker.number.int({ min: 0, max: 100 });

    const publishedAt = faker.date.recent({ days: 90 }).toISOString();

    const minimumContractDuration =
      listingType === ListingType.RENT
        ? faker.number.int({ min: 6, max: 36 })
        : undefined;

    const availableFrom =
      listingType === ListingType.RENT
        ? faker.date.soon({ days: 30 }).toISOString().split("T")[0]
        : undefined;

    return {
      id,
      property_id: property.id,
      agent_id: "",
      listing_type: listingType,
      price,
      currency,
      price_negotiable: priceNegotiable,
      whatsapp_contact: whatsappContact,
      expenses_amount: expensesAmount,
      expenses_included: expensesIncluded,
      status,
      featured,
      featured_until: featuredUntil,
      views_count: viewsCount,
      enquiries_count: enquiriesCount,
      whatsapp_clicks: whatsappClicks,
      published_at: publishedAt,
      minimum_contract_duration: minimumContractDuration,
      available_from: availableFrom,
    };
  });
}
