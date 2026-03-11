import { Skeleton } from "@/components/ui/skeleton"

export const SkeletonAgentList = () => {
  const items = Array.from({ length: 5 })
  return (
    <>
      {items.map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-62.5" />
            <Skeleton className="h-4 w-50" />
          </div>
        </div>
      ))}
    </>
  )
}
