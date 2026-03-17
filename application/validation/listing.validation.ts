import * as yup from "yup";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";
import { idSchema } from "./base/id.schema";
import { priceSchema } from "./base/price.schema";
import { Currency } from "@/domain/entities/property-listing.entity";
import i18next from "i18next";

export const createListingSchema = yup.object({
  property_id: idSchema,
  listing_type: yup
    .mixed<ListingType>()
    .oneOf(Object.values(ListingType))
    .default(ListingType.SALE)
    .required(),
  price: priceSchema.required(),
  currency: yup
    .mixed<Currency>()
    .oneOf(Object.values(Currency))
    .required()
    .default(Currency.COP),
  price_negotiable: yup.boolean().default(false),
  status: yup
    .mixed<ListingStatus>()
    .oneOf(Object.values(ListingStatus))
    .default(ListingStatus.DRAFT),
  meta_title: yup.string()
    .required(() => i18next.t('validations:required', {
      attribute: 'meta_title'
    }))
    .min(10, () => i18next.t('validations:min.string', {
      attribute: 'meta_title',
      min: '10'
    }))
    .max(100, () => i18next.t('validations:max.string', {
      attribute: 'meta_title',
      max: '100'
    })),
  meta_description: yup.string()
    .required(() => i18next.t('validations:required', {
      attribute: 'meta_description'
    }))
    .min(10, () => i18next.t('validations:min.string', {
      attribute: 'meta_description',
      min: '10'
    }))
    .max(500, () => i18next.t('validations:max.string', {
      attribute: 'meta_description',
      max: '500'
    })),
  keywords: yup.array()
    .of(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch {
          return [];
        }
      }
      return value;
    })
    .default([])
    .required(() => i18next.t('validations:required', {
      attribute: 'keywords'
    })),
  virtual_tour_url: yup.string()
    .url(() => i18next.t('validations:url', {
      attribute: 'virtual_tour_url'
    }))
    .max(200, () => i18next.t('validations:max.string', {
      attribute: 'virtual_tour_url',
      max: '200'
    }))
    .default(''),
  video_url: yup.string()
    .url(() => i18next.t('validations:url', {
      attribute: 'video_url'
    }))
    .max(200, () => i18next.t('validations:max.string', {
      attribute: 'video_url',
      max: '200'
    })),
  available_from: yup.date()
    .max(new Date(), () => i18next.t('validations:date', {
      attribute: 'available_from',
    })),
  minimum_contract_duration: yup.number()
    .integer(() => i18next.t('validations:integer', {
      attribute: 'minimum_contract_duration'
    }))
    .max(120, () => i18next.t('validations:max.numeric', {
      attribute: 'minimum_contract_duration',
      max: '120'
    })),
  whatsapp_contact: yup
    .string()
    .required(() => i18next.t('validations:required', {
      attribute: 'whatsapp_contact'
    }))
    .max(120, () => i18next.t('validations:max.string', {
      attribute: 'whatsapp_contact',
      max: '120'
    }))
    .matches(
      /^\+?[0-9\s-]+$/,
      i18next.t("forms.listing.fields.whatsapp_contact.message2")
    ),
});

export type CreateListingInput = yup.InferType<typeof createListingSchema>;

export const defaultPropertyValues: CreateListingInput = {
  property_id: '',
  listing_type: ListingType.SALE,
  price: 50000000,
  currency: Currency.COP,
  price_negotiable: false,
  status: ListingStatus.DRAFT,
  meta_title: 'fqfut755k44vy',
  meta_description: 'fqfut755k44vy',
  keywords: [],
  virtual_tour_url: 'https://fqfut755k44vy.ok.kimi.link/',
  video_url: 'https://fqfut755k44vy.ok.kimi.link/',
  available_from: new Date(),
  minimum_contract_duration: 12,
  whatsapp_contact: '+57 3168314191',
}
