'use client'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, Course } from '@/lib/types'
import { Calendar, BookOpen, Award, TrendingUp, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default function DashboardPage() {
  const { user } = useAuth()
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [recentCourses, setRecentCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch upcoming sessions
      const { data: sessions } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(*),
          teacher:users!sessions_teacher_id_fkey(*),
          learner:users!sessions_learner_id_fkey(*)
        `)
        .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
        .eq('status', 'confirmed')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5)

      setUpcomingSessions((sessions as Session[]) || [])

      // Fetch recent courses
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      setRecentCourses((courses as Course[]) || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: 'XScore',
      value: user?.x_score || 0,
      icon: TrendingUp,
      color: 'bg-primary-50 text-primary-600',
      bgColor: 'bg-primary-500',
    },
    {
      label: 'Credits',
      value: user?.credits || 0,
      icon: Award,
      color: 'bg-accent-50 text-accent-600',
      bgColor: 'bg-accent-500',
    },
    {
      label: 'Upcoming Sessions',
      value: upcomingSessions.length,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      label: 'Skills Learning',
      value: user?.skills_learning?.length || 0,
      icon: BookOpen,
      color: 'bg-green-50 text-green-600',
      bgColor: 'bg-green-500',
    },
  ]

  const getRoleMessage = () => {
    switch (user?.user_role) {
      case 'teacher':
        return 'Start teaching and earn credits!'
      case 'learner':
        return 'Explore courses and start learning!'
      case 'swapper':
        return 'Teach and learn to maximize your skills!'
      default:
        return 'Welcome to XSkill!'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Friend'}! 👋</h1>
        <p className="text-lg opacity-90">{getRoleMessage()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Role Status & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Current Role</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Role</span>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-semibold capitalize">
                {user?.user_role || 'Learner'}
              </span>
            </div>
            {user?.user_role === 'teacher' && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verified</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.is_verified_teacher 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.is_verified_teacher ? 'Yes' : 'Pending'}
                </span>
              </div>
            )}
            <Link
              href="/dashboard/profile"
              className="block w-full text-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mt-4"
            >
              Switch Role
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard/courses"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <BookOpen className="w-6 h-6 text-primary-600" />
              <span className="font-medium">Browse Courses</span>
            </Link>
            <Link
              href="/dashboard/sessions"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-accent-500 hover:bg-accent-50 transition-all"
            >
              <Calendar className="w-6 h-6 text-accent-600" />
              <span className="font-medium">My Sessions</span>
            </Link>
            {(user?.user_role === 'teacher' || user?.user_role === 'swapper') && !user?.is_verified_teacher && (
              <Link
                href="/dashboard/profile?tab=verification"
                className="col-span-2 flex items-center space-x-3 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg hover:border-blue-500 transition-all"
              >
                <Users className="w-6 h-6 text-blue-600" />
                <span className="font-medium">Get Verified to Teach</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upcoming Sessions</h3>
          <Link href="/dashboard/sessions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming sessions</p>
            <Link
              href="/dashboard/courses"
              className="inline-block mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Book a Session
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{session.course?.title}</h4>
                    <p className="text-sm text-gray-500">
                      {format(new Date(session.scheduled_at), 'MMM dd, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/sessions/${session.id}`}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Explore Courses</h3>
          <Link href="/dashboard/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/courses/${course.id}`}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-12 h-12 text-primary-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                  {course.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">
                    {course.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">{course.duration_minutes} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
