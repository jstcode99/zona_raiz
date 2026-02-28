"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ImageSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}