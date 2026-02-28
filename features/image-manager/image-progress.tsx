"use client"

import { Progress } from "@/components/ui/progress"

export function ImageProgress({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <Progress value={value} />
      <p className="text-xs text-muted-foreground text-right">
        {value}%
      </p>
    </div>
  )
}