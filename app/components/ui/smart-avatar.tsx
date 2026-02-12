"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useRef, useState } from "react"

type SmartAvatarProps = React.ComponentProps<typeof AvatarImage> & {
  fallback: string | ReactNode
  showSkeleton?: boolean
}

export function SmartAvatar({
  fallback,
  src,
  className,
  showSkeleton = true,
  ...imgProps
}: SmartAvatarProps) {
  const [displayedSrc, setDisplayedSrc] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!src) return

    setLoaded(false)

    let nextSrc: string

    if (typeof src === "string") {
      nextSrc = src
    } else {
      nextSrc = URL.createObjectURL(src)
      objectUrlRef.current = nextSrc
    }

    const img = new Image()
    img.src = nextSrc

    img.onload = () => {
      setDisplayedSrc(nextSrc)
      setLoaded(true)
    }

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [src])

  return (
    <Avatar className={cn("relative overflow-hidden", className)}>
      {/* 🦴 Skeleton */}
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 rounded-full bg-muted animate-pulse" />
      )}

      {/* 🖼 Image */}
      {displayedSrc && (
        <AvatarImage
          src={displayedSrc}
          {...imgProps}
          className={cn(
            "absolute inset-0 transition-opacity duration-200 ease-out",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* 🔤 Fallback */}
      <AvatarFallback
        className={cn(
          "absolute inset-0 transition-opacity duration-200",
          loaded ? "opacity-0" : "opacity-100"
        )}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  )
}
