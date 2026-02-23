'use client'

import { useEffect, useState } from 'react'
import { UserRole } from '@/domain/entities/Profile'

export function useUserRole(): { 
  role: UserRole | null
  loading: boolean 
} {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Leer cookie directamente (disponible en document.cookie)
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    const userRole = getCookie('user_role') as UserRole | null
    setRole(userRole)
    setLoading(false)
  }, [])

  return { role, loading }
}