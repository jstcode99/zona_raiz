"use client";

import { useEffect, useState, useTransition } from "react";
import { ImageDropzone } from "./image-dropzone";
import { ImagePreviewCard } from "./image-preview-card";
import { ImageProgress } from "./image-progress";
import { Button } from "@/components/ui/button";
import { createPropertyImageAction } from "@/application/actions/property-image.action";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface LocalFile {
  id: string;
  file: File;
  preview: string;
  isPrimary: boolean;
  order: number;
}

export function UploadMultipleInput({
  propertyId,
  onSuccessAction,
}: {
  propertyId: string;
  onSuccessAction?: () => void;
}) {
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [pending, startTransition] = useTransition();
  const { t } = useTranslation("images");

  function addFiles(incoming: File[]) {
    const mapped = incoming.map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isPrimary: files.length === 0 && index === 0,
      order: files.length + index,
    }));

    setFiles((prev) => [...prev, ...mapped]);
  }

  function removeFile(id: string) {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.preview);

      const next = prev.filter((f) => f.id !== id);

      // si eliminas el primary → asigna otro
      if (!next.some((f) => f.isPrimary) && next.length > 0) {
        next[0].isPrimary = true;
      }

      return next.map((f, i) => ({ ...f, order: i }));
    });
  }

  function setPrimary(id: string) {
    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        isPrimary: file.id === id,
      })),
    );
  }

  function submit() {
    if (!files.length) return;

    startTransition(async () => {
      const results = await Promise.all(
        files.map(async (item) => {
          const formData = new FormData();
          formData.append("file", item.file);
          formData.append("display_order", String(item.order));
          formData.append("is_primary", String(item.isPrimary));
          formData.append("alt_text", item.file.name);
          formData.append("caption", item.file.name);

          const response = await createPropertyImageAction(
            propertyId,
            formData,
          );

          if (!response.success) {
            const message =
              response.error?.message ??
              response.errors?.[0]?.message ??
              t("validation.errors_found");
            toast.error(message);
            return false;
          }

          toast.success(t("messages.import-success"));
          return true;
        }),
      );

      setFiles([]);
      if (results.some(Boolean)) {
        onSuccessAction?.();
      }
    });
  }

  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  return (
    <div className="space-y-4">
      <ImageDropzone onFilesSelect={addFiles} disabled={pending} />

      {files.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {files.map((item) => (
              <ImagePreviewCard
                key={item.id}
                imageUrl={item.preview}
                isPrimary={item.isPrimary}
                onPrimary={() => setPrimary(item.id)}
                onDelete={() => removeFile(item.id)}
              />
            ))}
          </div>

          {pending && <ImageProgress value={60} />}

          <Button onClick={submit} disabled={pending} className="w-full">
            {t("actions.upload_count", { count: files.length })}
          </Button>
        </>
      )}
    </div>
  );
}
