'use client'

import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function Hero() {
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
        toast.success(data.message || 'Successfully signed up! Check your email for confirmation.')
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50"></div>
      
      {/* Decorative Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-30 w-auto">
            <Image
              src="/logo.png"
              alt="XSkill Logo"
              width={450}
              height={450}
              className="h-30 w-auto object-contain"
              priority
            />
          </div>
        </div>
        
        <h3 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
          <span className="block text-gray-900">Exchange Skills,</span>
          <span className="block bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            Not Money.
          </span>
        </h3>
        
        <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
          Teach what you know. Learn what you love. Earn and spend credits through community skill sharing.
        </p>

        {/* Email Signup Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-5 rounded-full border-2 border-gray-200 focus:border-primary-500 focus:outline-none text-lg"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-5 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Joining...' : 'Join Early Access'}
            </button>
          </div>
        </form>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}

