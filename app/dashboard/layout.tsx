'use client'

import { useAuth } from '@/hooks/useAuth'
import DashboardNav from '@/components/DashboardNav'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, loading, initialized } = useAuth()

  useEffect(() => {
    if (initialized && !loading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, loading, initialized, router])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
