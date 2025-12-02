'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSignup = () => {
    const element = document.getElementById('early-access')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="relative h-18 w-auto">
                <Image
                  src="/logo.png"
                  alt="XSkill Logo"
                  width={150}
                  height={150}
                  className="h-18 w-auto object-contain"
                  priority
                />
              </div>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/auth/signin"
              className="px-6 py-2 text-gray-700 hover:text-primary-600 font-semibold transition-colors"
            >
              Sign In
            </a>
            <a
              href="/auth/signup"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
