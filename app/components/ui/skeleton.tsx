import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

function HeroSkeleton() {
  return (
    <div className="relative w-full min-h-screen bg-neutral-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[calc(100vh-64px)] flex items-center">
        <div className="flex items-center justify-between w-full gap-8">
          <div className="flex-1 max-w-lg space-y-6">
            <div className="h-20 w-3/4 bg-neutral-300 rounded-lg" />
            <div className="h-20 w-1/2 bg-neutral-300 rounded-lg" />
            <div className="h-20 w-2/3 bg-neutral-300 rounded-lg" />
            <div className="h-11 w-40 bg-neutral-300 rounded-full mt-8" />
          </div>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="h-6 w-3/4 bg-neutral-200 rounded" />
            <div className="h-4 w-1/2 bg-neutral-200 rounded" />
            <div className="h-11 bg-neutral-200 rounded-xl" />
            <div className="h-11 bg-neutral-200 rounded-xl" />
            <div className="flex gap-2">
              <div className="flex-1 h-11 bg-neutral-200 rounded-xl" />
              <div className="flex-1 h-11 bg-neutral-200 rounded-xl" />
            </div>
            <div className="h-11 bg-neutral-200 rounded-xl" />
            <div className="h-12 bg-orange-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TrustSectionSkeleton() {
  return (
    <div className="w-full py-16 bg-white border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="shrink-0 space-y-4">
            <div className="h-10 w-48 bg-neutral-200 rounded" />
            <div className="h-10 w-36 bg-neutral-200 rounded" />
            <div className="flex items-center gap-2">
              <div className="flex">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 -ml-2" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 -ml-2" />
              </div>
              <div className="h-4 w-20 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="hidden lg:block w-px h-20 bg-neutral-200 shrink-0" />
          <div className="max-w-sm space-y-4">
            <div className="h-4 w-full bg-neutral-200 rounded" />
            <div className="h-9 w-full bg-neutral-200 rounded-full" />
          </div>
          <div className="hidden lg:block w-px h-20 bg-neutral-200 shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-5 w-16 bg-neutral-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-neutral-100">
      <div className="aspect-[4/3] bg-neutral-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-6 w-1/3 bg-neutral-200 rounded" />
        <div className="h-5 w-2/3 bg-neutral-200 rounded" />
        <div className="flex justify-between pt-2">
          <div className="h-5 w-1/4 bg-neutral-200 rounded" />
          <div className="h-5 w-1/4 bg-neutral-200 rounded" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-4 w-12 bg-neutral-200 rounded" />
          <div className="h-4 w-12 bg-neutral-200 rounded" />
          <div className="h-4 w-12 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  )
}

function ListingsSectionSkeleton() {
  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-neutral-200 rounded" />
            <div className="h-4 w-32 bg-neutral-200 rounded" />
          </div>
          <div className="h-10 w-32 bg-neutral-200 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

function CitiesSectionSkeleton() {
  return (
    <div className="w-full py-16 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-neutral-200 rounded" />
            <div className="h-4 w-32 bg-neutral-200 rounded" />
          </div>
          <div className="h-10 w-32 bg-neutral-200 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <div className="w-36 h-36 rounded-full bg-neutral-200" />
              <div className="h-5 w-24 bg-neutral-200 rounded" />
              <div className="h-4 w-16 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton, HeroSkeleton, TrustSectionSkeleton, ListingCardSkeleton, ListingsSectionSkeleton, CitiesSectionSkeleton }
