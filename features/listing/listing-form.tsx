"use client";

import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import type { ActionResult } from "@/shared/hooks/use-server-mutation.hook";
import {
  CreateListingInput,
  createListingSchema,
  defaultPropertyValues,
} from "@/application/validation/listing.validation";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { Form } from "@/components/ui/form";
import { currencyOptions } from "@/domain/entities/currency.enums";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import {
  createListingAction,
  updateListingAction,
} from "@/application/actions/listing.actions";
import { flatten } from "@/lib/utils";
import { Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useListingOptions } from "./hooks/use-listing-options";

interface ListingFormProps {
  id?: string;
  property_id?: string;
  defaultValues?: Partial<CreateListingInput>;
}

export function ListingForm({
  id,
  property_id,
  defaultValues = defaultPropertyValues,
}: ListingFormProps) {
  const { t } = useTranslation("listings");
  const { listingTypeOptions, listingStatusOptions, keywordsOptions } =
    useListingOptions();

  const isUpdateMode = !!id;

  const form = useForm<CreateListingInput>({
    resolver: yupResolver(createListingSchema) as Resolver<CreateListingInput>,
    defaultValues: defaultValues,
    mode: "onBlur",
  });

  const { reset, setError, watch } = form;

  const type = watch("listing_type");

  const mutation = useServerMutation({
    action: ((formData: FormData) => {
      if (isUpdateMode && id) {
        return updateListingAction(id, formData);
      }
      return createListingAction(formData);
    }) as unknown as (formData: FormData) => Promise<ActionResult>,
    setError,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(t(`labels${isUpdateMode} ? "updated" : "created"}`));
        if (!isUpdateMode) reset();
      }
    },
    onError: (error) => {
      console.error("listing error:", error);
      toast.error(t("labels"));
    },
  });

  useEffect(() => {
    if (isUpdateMode && defaultValues) {
      reset(defaultValues);
    }
    if (property_id) {
      reset((prev) => ({
        ...prev,
        property_id,
      }));
    }
  }, [id, defaultValues, reset]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (mutation.isError) mutation.reset();
    });
    return () => subscription.unsubscribe();
  }, [form, mutation]);

  async function handleSubmit(values: CreateListingInput) {
    try {
      const formData = new FormData();
      const data = flatten(values, "", formData);
      // Asegurar que keywords se envíe como JSON string
      if (values.keywords) {
        data.set("keywords", JSON.stringify(values.keywords));
      }
      mutation.action(data);
    } catch (error) {
      console.error(error);
      toast.error(t("labels"));
    }
  }

  return (
    <Form
      form={form}
      onSubmit={handleSubmit}
      className="space-y-3 max-w-5xl mx-auto"
    >
      <Form.Set legend={t("sections.basic-info")} className="my-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Form.Select
            name="listing_type"
            label={t("labels.listing_type")}
            options={listingTypeOptions}
          />

          <Form.Select
            name="status"
            label={t("labels.status")}
            options={listingStatusOptions}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Form.Input name="price" label={t("labels.price")} type="currency" />

          <Form.Select
            name="currency"
            label={t("labels.currency")}
            options={currencyOptions}
          />

          <Form.Input
            name="expenses_amount"
            label={t("labels.expenses_amount")}
            type="currency"
          />
        </div>
      </Form.Set>
      <Form.Set legend={t("basic-info")} className="my-3">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Form.Checkbox
            name="price_negotiable"
            label={t("labels.price_negotiable")}
          />
          <Form.Checkbox
            name="expenses_included"
            label={t("labels.expenses_included")}
          />
          <Form.Checkbox
            name="featured"
            label={
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                {t("labels.featured")}
              </span>
            }
          />
        </div>
      </Form.Set>
      <Form.Set legend={t("sections.basic-info")} className="my-3">
        <Form.Input name="meta_title" label={t("labels.meta_title")} />

        <Form.Textarea
          name="meta_description"
          label={t("labels.meta_description")}
          rows={4}
        />

        <Form.Combobox
          name="keywords"
          label={t("labels.keywords")}
          multiple
          options={keywordsOptions}
          placeholder={t("placeholders.add_keyword")}
        />
      </Form.Set>
      <Form.Set legend={t("basic-info")} className="my-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Form.Url
            name="virtual_tour_url"
            label={t("labels.virtual_tour_url")}
          />

          <Form.Url name="video_url" label={t("labels.video_url")} />
        </div>
      </Form.Set>
      <Form.Set legend={t("sections.basic-info")} className="my-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Form.Date
            name="available_from"
            label={t("labels.available_from")}
            fromYear={1950}
            toYear={2050}
          />

          <Form.Input
            className={type === "rent" ? "" : "pointer-events-none opacity-50"}
            name="minimum_contract_duration"
            label={t("labels.minimum_contract_duration")}
            type="number"
          />

          <Form.Phone
            name="whatsapp_contact"
            label={
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {t("labels.whatsapp_contact")}
              </span>
            }
          />
        </div>
      </Form.Set>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending
          ? t("commons:words.create")
          : isUpdateMode
            ? t("actions.update")
            : t("actions.create")}
      </Button>
    </Form>
  );
}
