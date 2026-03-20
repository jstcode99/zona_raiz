"use client"

import { Suspense, use } from "react"
import { UploadMultipleInput } from "./upload-multiple-input"
import { ImageSkeleton } from "./image-skeleton"
import { PropertyImageEntity } from "@/domain/entities/property-image.entity"
import { PropertyImageList } from "./property-images-list"

export function PropertyImagesManager({
  propertyId,
  fetch
}: {
  propertyId: string,
  fetch: Promise<PropertyImageEntity[]>
}
) {
  const images = use(fetch)

  return (
    <div className="space-y-6">
      <UploadMultipleInput propertyId={propertyId} />

      <Suspense
        fallback={
          <div className="grid md:grid-cols-3 gap-4">
            <ImageSkeleton />
            <ImageSkeleton />
            <ImageSkeleton />
          </div>
        }
      >
        <PropertyImageList initialImages={images} propertyId={propertyId} />
      </Suspense>
    </div>
  )
}