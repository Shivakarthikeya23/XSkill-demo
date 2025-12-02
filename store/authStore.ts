import { create } from 'zustand'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  authUser: SupabaseUser | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setAuthUser: (authUser: SupabaseUser | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  authUser: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setAuthUser: (authUser) => set({ authUser }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, authUser: null })
  },

  refreshUser: async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (authUser) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      set({ authUser, user: userData })
    } else {
      set({ authUser: null, user: null })
    }
  },
}))
