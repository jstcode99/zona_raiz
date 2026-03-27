import {
  listingStatusValues,
  listingTypeValues,
} from "@/domain/entities/listing.enums";
import i18next from "i18next";
import * as yup from "yup";

export const statusSchema = yup
  .string<string>()
  .oneOf(
    listingStatusValues,
    i18next.t("validations:required", { attribute: "status" }),
  );
