"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ComponentProps, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import {
  OTPFormInput,
  otpSchema,
} from "@/application/validation/auth.validation";
import { sentOtpAction } from "@/application/actions/auth.actions";
import { useRoutes } from "@/i18n/client-router";

export function OTPForm({ className, ...props }: ComponentProps<"form">) {
  const { t } = useTranslation("auth");
  const routes = useRoutes();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<OTPFormInput>({
    resolver: yupResolver(otpSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const mutation = useServerMutation({
    action: sentOtpAction,
    onSuccess: () => {
      toast.success(t("messages.success.otp_sent"));
      reset();
    },
    onError: (error) => {
      console.error("OTP error:", error);
    },
  });

  useEffect(() => {
    if (mutation.isSuccess) reset();
  }, [mutation.isSuccess, reset]);

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append("email", values.email);
    mutation.action(formData);
  });

  const isLoading = isSubmitting || mutation.isPending;

  return (
    <form
      {...props}
      className={cn("py-14 px-6", className)}
      onSubmit={onSubmit}
    >
      <FieldGroup className="gap-4">
        {/* Header */}
        <div
          className="flex flex-col items-center gap-2 text-center"
          style={{ animation: "authFadeIn 0.4s ease 0ms both" }}
        >
          <h1 className="text-2xl font-bold">{t("titles.otp")}</h1>
          <p className="text-muted-foreground text-sm">{t("subtitles.otp")}</p>
        </div>

        {/* Email */}
        <div style={{ animation: "authFadeIn 0.4s ease 60ms both" }}>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="form-email">{t("labels.email")}</FieldLabel>
            <Input
              id="form-email"
              type="email"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>
        </div>

        {/* Back to sign in */}
        <div style={{ animation: "authFadeIn 0.4s ease 100ms both" }}>
          <Link
            href={routes.signin()}
            className="ml-auto block text-right text-sm underline-offset-2 hover:underline"
          >
            {t("actions.otp_basic")}
          </Link>
        </div>

        {/* Submit */}
        <div style={{ animation: "authFadeIn 0.4s ease 140ms both" }}>
          <Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Spinner data-icon="inline-start" className="mr-2 h-4 w-4" />
              )}
              {t("actions.request_code")}
            </Button>
          </Field>
        </div>
      </FieldGroup>

      <style>{`
        @keyframes authFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </form>
  );
}
