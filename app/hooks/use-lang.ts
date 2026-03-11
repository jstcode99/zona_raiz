import { Lang } from "@/infrastructure/config/routes"
import { getClientLang, setClientLang } from "@/lib/utils"
import { useState, useEffect } from "react"

export function useLang() {
  const [lang, setLang] = useState<Lang>("es")

  useEffect(() => {
    const detected = getClientLang()
    setLang(detected)
  }, [])

  const changeLang = (newLang: Lang) => {
    setLang(newLang)
    setClientLang(newLang)
    // opcional: recargar la página para que middleware respete la cookie
    window.location.reload()
  }

  return { lang, changeLang }
}