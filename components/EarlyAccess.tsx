'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function EarlyAccess() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Successfully signed up for early access!')
        setEmail('')
      } else {
        toast.error(data.error || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="early-access" className="py-20 bg-gradient-to-br from-primary-600 to-accent-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Get Early Access
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Be among the first to experience XSkill. Join our waitlist and get notified when we launch.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-white text-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-white text-primary-500 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Joining...' : 'Join Now'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

