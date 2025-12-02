'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Home, BookOpen, Calendar, User, Award, LogOut, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/courses', label: 'Courses', icon: BookOpen },
    { href: '/dashboard/sessions', label: 'Sessions', icon: Calendar },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800'
      case 'learner':
        return 'bg-green-100 text-green-800'
      case 'swapper':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="XSkill" width={120} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side - User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Credits */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-accent-50 rounded-full">
              <Award className="w-4 h-4 text-accent-600" />
              <span className="text-sm font-semibold text-accent-900">{user?.credits || 0} Credits</span>
            </div>

            {/* XScore */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary-50 rounded-full">
              <span className="text-sm font-semibold text-primary-900">XScore: {user?.x_score || 0}</span>
            </div>

            {/* Role Badge */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${getRoleBadgeColor(user?.user_role || 'learner')}`}>
              {user?.user_role || 'Learner'}
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Sign Out */}
            <button
              onClick={signOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-gray-600">Credits</span>
                <span className="font-semibold text-accent-600">{user?.credits || 0}</span>
              </div>
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-gray-600">XScore</span>
                <span className="font-semibold text-primary-600">{user?.x_score || 0}</span>
              </div>
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-gray-600">Role</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getRoleBadgeColor(user?.user_role || 'learner')}`}>
                  {user?.user_role || 'Learner'}
                </span>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
