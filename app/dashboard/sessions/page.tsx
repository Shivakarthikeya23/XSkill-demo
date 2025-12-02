'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Session } from '@/lib/types'
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'

export default function SessionsPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user, filter])

  const fetchSessions = async () => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('sessions')
        .select(`
          *,
          course:courses(*),
          teacher:users!sessions_teacher_id_fkey(*),
          learner:users!sessions_learner_id_fkey(*)
        `)
        .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
        .order('scheduled_at', { ascending: false })

      if (filter === 'upcoming') {
        query = query
          .gte('scheduled_at', new Date().toISOString())
          .in('status', ['pending', 'confirmed'])
      } else if (filter === 'past') {
        query = query.in('status', ['completed', 'cancelled', 'no_show'])
      }

      const { data, error } = await query

      if (error) throw error
      setSessions((data as Session[]) || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Pending' }
      case 'confirmed':
        return { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Confirmed' }
      case 'completed':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed' }
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelled' }
      case 'no_show':
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'No Show' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, text: status }
    }
  }

  const getRoleInSession = (session: Session) => {
    if (session.teacher_id === user?.id) return 'teacher'
    if (session.learner_id === user?.id) return 'learner'
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
          <p className="text-gray-600 mt-1">View and manage your learning sessions</p>
        </div>
        <Link
          href="/dashboard/courses"
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Book New Session
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          {(['all', 'upcoming', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'upcoming' 
              ? 'You don\'t have any upcoming sessions' 
              : filter === 'past'
              ? 'You don\'t have any past sessions'
              : 'You haven\'t booked any sessions yet'}
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const status = getStatusBadge(session.status)
            const StatusIcon = status.icon
            const role = getRoleInSession(session)
            const otherUser = role === 'teacher' ? session.learner : session.teacher

            return (
              <div
                key={session.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-primary-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {session.course?.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(session.scheduled_at), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(session.scheduled_at), 'h:mm a')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration_minutes} min
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.text}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        role === 'teacher' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        You are the {role}
                      </span>
                      {otherUser && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>
                            {role === 'teacher' ? 'Learner' : 'Teacher'}: {otherUser.name || otherUser.email}
                          </span>
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        📝 {session.notes}
                      </p>
                    )}

                    {session.meeting_link && session.status === 'confirmed' && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        🔗 Join Meeting
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {session.status === 'pending' && role === 'teacher' && (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                        Confirm Session
                      </button>
                    )}
                    {session.status === 'completed' && !session.learner_rating && role === 'learner' && (
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                        Rate Session
                      </button>
                    )}
                    {session.status === 'completed' && session.learner_rating && (
                      <div className="text-sm text-gray-600">
                        ⭐ Rated: {session.learner_rating}/5
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
