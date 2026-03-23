"use client";

import { ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import {
  defaultUserValues,
  UserInput,
  userSchema,
} from "@/application/validation/user.validation";
import { EUserRole } from "@/domain/entities/profile.entity";
import {
  createUserAction,
  updateUserAction,
} from "@/application/actions/user.actions";

interface UserFormProps extends ComponentProps<"form"> {
  id?: string;
  defaultValues?: UserInput;
}

export function UserForm({
  className,
  id,
  defaultValues,
  ...props
}: UserFormProps) {
  const { t } = useTranslation("profile");
  const isUpdateMode = Boolean(id);

  const form = useForm<UserInput>({
    resolver: yupResolver(userSchema),
    defaultValues: defaultValues ?? defaultUserValues,
    mode: "onBlur",
  });

  const {
    reset,
    formState: { isSubmitting, isDirty },
  } = form;

  const mutation = useServerMutation({
    action: isUpdateMode ? updateUserAction : createUserAction,
    setError: form.setError,
    onSuccess: () => {
      toast.success(
        t(`profile.${isUpdateMode ? "updated" : "created"}`) ||
          (isUpdateMode ? "User updated" : "User created"),
      );
      if (!isUpdateMode) reset(defaultUserValues);
    },
    onError: (error) => {
      toast.error(error.message || t("words.error") || "Error");
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = (values: UserInput) => {
    const data = new FormData();
    if (id) data.append("id", id);
    data.append("email", values.email);
    data.append("full_name", values.full_name ?? "");
    data.append("role", String(values.role));
    mutation.action(data);
  };

  const isLoading = isSubmitting || mutation.isPending;

  return (
    <Form
      {...props}
      form={form}
      className={cn("p-4 mx-auto space-y-4", className)}
      onSubmit={onSubmit}
    >
      <Form.Set legend={t("sections.basic_data") || "User"}>
        <Form.Input
          name="email"
          label={t("labels.email") || "Email"}
          placeholder={t("placeholder.email") || "user@email.com"}
          autoComplete="email"
          disabled={isLoading}
        />

        <Form.Input
          name="full_name"
          label={t("labels.full_name") || "Full name"}
          placeholder={t("placeholder.full_name") || "John Doe"}
          autoComplete="name"
          disabled={isLoading}
        />

        <Form.Select
          name="role"
          label={t("labels.role") || "Role"}
          placeholder={t("words.select") || "Select"}
          options={[
            { label: "admin", value: EUserRole.Admin },
            { label: "real-estate", value: EUserRole.RealEstate },
            { label: "client", value: EUserRole.Client },
          ]}
        />
      </Form.Set>

      <Button type="submit" className="w-full" disabled={isLoading || !isDirty}>
        {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
        {t("actions.save_changes")}
      </Button>
    </Form>
  );
}
