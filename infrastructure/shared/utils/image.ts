// infrastructure/shared/utils/image.ts
// Image utilities that use DOM/browser APIs

export const optimizeImage = (file: File, maxWidth = 512): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const scale = Math.min(maxWidth / img.width, 1);
      const canvas = document.createElement("canvas");

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          resolve(
            new File([blob], file.name, {
              type: "image/webp",
              lastModified: Date.now(),
            }),
          );
        },
        "image/webp",
        0.8,
      );
    };

    reader.readAsDataURL(file);
  });
};
