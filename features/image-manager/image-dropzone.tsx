"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { UploadCloud } from "lucide-react";

interface Props {
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageDropzone({ onFilesSelect, disabled }: Props) {
  const { t } = useTranslation("components");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;
      onFilesSelect(acceptedFiles);
    },
    [onFilesSelect],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
        "image/svg+xml": [],
      },
      multiple: true,
      disabled,
      onDrop,
    });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition
        hover:bg-muted/40
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isDragActive ? "border-primary bg-muted/40" : ""}
        ${isDragReject ? "border-destructive" : ""}
      `}
    >
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto mb-2" />

      {isDragActive
        ? t("property_images.drop_here")
        : t("property_images.drag_drop")}
    </div>
  );
}
