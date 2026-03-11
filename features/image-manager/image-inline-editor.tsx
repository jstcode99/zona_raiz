"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "react-i18next"
import { useEffect, useRef, useState } from "react"

interface Props {
  alt?: string
  caption?: string
  onChange: (data: { alt_text?: string; caption?: string }) => void
}

export function ImageInlineEditor({ alt, caption, onChange }: Props) {
  const { t } = useTranslation('components')

  const [altValue, setAltValue] = useState(alt ?? "")
  const [captionValue, setCaptionValue] = useState(caption ?? "")

  const lastSent = useRef({
    alt: alt ?? "",
    caption: caption ?? ""
  })

  useEffect(() => {
    setAltValue(alt ?? "")
    setCaptionValue(caption ?? "")
    lastSent.current = { alt: alt ?? "", caption: caption ?? "" }
  }, [alt, caption])

  useEffect(() => {
    const timer = setTimeout(() => {
      const changedAlt = altValue !== lastSent.current.alt
      const changedCaption = captionValue !== lastSent.current.caption

      if (!changedAlt && !changedCaption) return

      lastSent.current = { alt: altValue, caption: captionValue }

      onChange({
        alt_text: altValue,
        caption: captionValue
      })
    }, 800)

    return () => clearTimeout(timer)
  }, [altValue, captionValue, onChange])

  return (
    <div className="space-y-2 p-3">
      <Input
        placeholder={t("components.property-images.alt")}
        value={altValue}
        onChange={e => setAltValue(e.target.value)}
      />

      <Textarea
        placeholder={t("components.property-images.caption")}
        value={captionValue}
        onChange={e => setCaptionValue(e.target.value)}
      />
    </div>
  )
}