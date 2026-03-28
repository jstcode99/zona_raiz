"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { createEnquiryAction } from "@/application/actions/enquiry.actions";
import {
  defaultEnquiryValues,
  EnquiryFormValues,
  enquirySchema,
} from "@/application/validation/enquiry.schema";
import { flatten } from "@/lib/utils";

interface EnquiryFormProps {
  listingId: string;
  realEstateId: string;
}

export function EnquiryForm({ listingId, realEstateId }: EnquiryFormProps) {
  const { t } = useTranslation("listings");

  const form = useForm<EnquiryFormValues>({
    resolver: yupResolver(enquirySchema) as any,
    defaultValues: {
      ...defaultEnquiryValues,
      listing_id: listingId,
      real_estate_id: realEstateId,
    },
    mode: "onBlur",
  });

  const {
    setError,
    formState: { isSubmitting },
  } = form;

  const mutation = useServerMutation({
    action: createEnquiryAction,
    setError,
    onSuccess: (response) => {
      toast.success(t("detail.contact.success"));
      form.reset({
        ...defaultEnquiryValues,
        listing_id: listingId,
        real_estate_id: realEstateId,
      });
      const { whatsappUrl } = response?.data ?? {};
      if (whatsappUrl) {
        window.location.href = whatsappUrl as string;
      }
    },
    onError: (error) => {
      toast.error(t("detail.contact.error"));
      console.error("Enquiry error:", error);
    },
  });

  const onSubmit = (values: EnquiryFormValues) => {
    try {
      const formData = new FormData();
      const data = flatten(values, "", formData);
      mutation.action(data);
    } catch (error) {
      console.error(error);
      toast.error(t("labels"));
    }
  };

  const isLoading = isSubmitting || mutation.isPending;

  return (
    <Card>
      <CardHeader className="py-1">
        <CardTitle className="text-lg">{t("detail.contact.title")}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t("detail.contact.subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={onSubmit}>
          <div className="space-y-4">
            <Form.Input
              name="name"
              label={t("detail.contact.name")}
              placeholder={t("detail.contact.placeholder.name")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Input
                name="email"
                type="email"
                label={t("detail.contact.email")}
                placeholder={t("detail.contact.placeholder.email")}
              />

              <Form.Phone
                name="phone"
                label={t("detail.contact.phone")}
                placeholder={t("detail.contact.placeholder.phone")}
              />
            </div>

            <Form.Textarea
              name="message"
              label={t("detail.contact.message")}
              placeholder={t("detail.contact.placeholder.message")}
              rows={3}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />
              )}
              {t("detail.contact.submit")}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
