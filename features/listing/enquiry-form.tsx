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
    action: createEnquiryAction as any,
    setError,
    onSuccess: (result) => {
      if (result.success && "whatsappUrl" in result && result.whatsappUrl) {
        toast.success(t("detail.contact.success"));
        form.reset({
          ...defaultEnquiryValues,
          listing_id: listingId,
          real_estate_id: realEstateId,
        });

        // Redirect to WhatsApp
        window.location.href = result.whatsappUrl as string;
      } else if (result.success) {
        toast.success(t("detail.contact.success"));
        form.reset({
          ...defaultEnquiryValues,
          listing_id: listingId,
          real_estate_id: realEstateId,
        });
      }
    },
    onError: (error) => {
      toast.error(t("detail.contact.error"));
      console.error("Enquiry error:", error);
    },
  });

  const onSubmit = (_values: EnquiryFormValues) => {
    const formData = new FormData();
    formData.append("listing_id", listingId);
    formData.append("real_estate_id", realEstateId);
    formData.append("name", form.getValues("name") || "");
    formData.append("email", form.getValues("email") || "");
    formData.append("phone", form.getValues("phone") || "");
    formData.append("message", form.getValues("message") || "");
    formData.append("source", "web");

    mutation.action(formData);
  };

  const isLoading = isSubmitting || mutation.isPending;

  return (
    <Card>
      <CardHeader className="pb-4">
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