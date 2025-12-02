'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const router = useRouter()
  const { user, authUser, loading, initialized, setUser, setAuthUser, setLoading, setInitialized, signOut, refreshUser } = useAuthStore()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setAuthUser(session.user)
          
          // Fetch user profile
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser(userData)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    if (!initialized) {
      initializeAuth()
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAuthUser(session.user)
        
        // Fetch user profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        setUser(userData)
      } else {
        setAuthUser(null)
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialized, setUser, setAuthUser, setLoading, setInitialized])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return {
    user,
    authUser,
    loading,
    initialized,
    isAuthenticated: !!authUser,
    signOut: handleSignOut,
    refreshUser,
  }
}

export function useRequireAuth(redirectTo = '/auth/signin') {
  const router = useRouter()
  const { isAuthenticated, loading, initialized } = useAuth()

  useEffect(() => {
    if (initialized && !loading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, initialized, router, redirectTo])

  return { isAuthenticated, loading }
}
