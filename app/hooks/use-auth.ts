'use client'

import { useEffect, useState, useCallback } from 'react'
import { AuthError } from '@supabase/supabase-js'
import { UserRole } from '@/domain/entities/Profile'
import { createSupabaseBrowserClient } from '@/lib/supabase.client'

interface AuthUser {
  id: string
  email: string
  role: UserRole
  fullName: string | null
  avatarUrl: string | null
}

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: AuthError | null
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const supabase = await createSupabaseBrowserClient()

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError

      if (!session?.user) {
        setUser(null)
        return
      }

      // Obtener perfil con rol desde la tabla profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, full_name, avatar_url')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        // Si no hay perfil, usar datos básicos del usuario auth
        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: 'client', // Rol por defecto
          fullName: session.user.user_metadata?.full_name || null,
          avatarUrl: session.user.user_metadata?.avatar_url || null,
        })
        return
      }

      setUser({
        id: session.user.id,
        email: session.user.email!,
        role: profile.role as UserRole,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
      })

    } catch (err) {
      setError(err as AuthError)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()

    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refreshUser: fetchUser,
  }
}