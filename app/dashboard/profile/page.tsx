'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { User, Upload, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  })

  const [roleData, setRoleData] = useState({
    user_role: user?.user_role || 'learner',
  })

  const [verificationData, setVerificationData] = useState({
    degree_url: '',
    experience_years: 0,
    expertise_areas: '',
    additional_info: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
      })
      setRoleData({
        user_role: user.user_role,
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          bio: formData.bio,
        })
        .eq('id', user?.id)

      if (error) throw error

      await refreshUser()
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (newRole: string) => {
    if (!user) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ user_role: newRole })
        .eq('id', user.id)

      if (error) throw error

      await refreshUser()
      setRoleData({ user_role: newRole as any })
      toast.success(`Role switched to ${newRole}!`)
    } catch (error: any) {
      console.error('Error changing role:', error)
      toast.error(error.message || 'Failed to change role')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const expertiseArray = verificationData.expertise_areas
        .split(',')
        .map(s => s.trim())
        .filter(s => s)

      const { error } = await supabase
        .from('teacher_verifications')
        .insert({
          user_id: user?.id!,
          degree_url: verificationData.degree_url,
          experience_years: verificationData.experience_years,
          expertise_areas: expertiseArray,
          additional_info: verificationData.additional_info,
          status: 'pending',
        })

      if (error) throw error

      // Update user teacher_status
      await supabase
        .from('users')
        .update({ teacher_status: 'pending' })
        .eq('id', user?.id)

      await refreshUser()
      toast.success('Verification request submitted! We will review it shortly.')
      setVerificationData({
        degree_url: '',
        experience_years: 0,
        expertise_areas: '',
        additional_info: '',
      })
    } catch (error: any) {
      console.error('Error submitting verification:', error)
      toast.error(error.message || 'Failed to submit verification')
    } finally {
      setLoading(false)
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'learner':
        return 'Focus on learning new skills. Use credits to book sessions with teachers.'
      case 'teacher':
        return 'Teach skills to others and earn credits. Requires verification.'
      case 'swapper':
        return 'Both teach and learn! Earn credits by teaching, spend them by learning.'
      default:
        return ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['profile', 'role', 'verification'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell others about yourself..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Role Tab */}
          {activeTab === 'role' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Role</h3>
                <p className="text-gray-600 capitalize">{user?.user_role}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Switch Role</h3>
                
                {(['learner', 'teacher', 'swapper'] as const).map((role) => (
                  <div
                    key={role}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      user?.user_role === role
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold capitalize mb-2">{role}</h4>
                        <p className="text-sm text-gray-600 mb-4">{getRoleDescription(role)}</p>
                        
                        {role === 'teacher' && !user?.is_verified_teacher && (
                          <p className="text-sm text-amber-600 mb-2">
                            ⚠️ Requires verification to teach
                          </p>
                        )}
                        
                        {user?.user_role !== role && (
                          <button
                            onClick={() => handleRoleChange(role)}
                            disabled={loading || (role === 'teacher' && !user?.is_verified_teacher)}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            Switch to {role}
                          </button>
                        )}
                      </div>
                      
                      {user?.user_role === role && (
                        <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Teacher Verification</h3>
                <p className="text-gray-600">
                  Submit your credentials to become a verified teacher and start earning credits.
                </p>
              </div>

              {/* Verification Status */}
              {user?.teacher_status && user.teacher_status !== 'none' && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  user.teacher_status === 'approved' ? 'bg-green-50 text-green-800' :
                  user.teacher_status === 'pending' ? 'bg-yellow-50 text-yellow-800' :
                  'bg-red-50 text-red-800'
                }`}>
                  {user.teacher_status === 'approved' && <CheckCircle className="w-6 h-6" />}
                  {user.teacher_status === 'pending' && <Clock className="w-6 h-6" />}
                  {user.teacher_status === 'rejected' && <XCircle className="w-6 h-6" />}
                  <div>
                    <p className="font-semibold capitalize">{user.teacher_status}</p>
                    <p className="text-sm">
                      {user.teacher_status === 'approved' && 'You are verified and can now teach!'}
                      {user.teacher_status === 'pending' && 'Your verification is under review'}
                      {user.teacher_status === 'rejected' && 'Your verification was rejected. Please submit again with updated information.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Form */}
              {(!user?.teacher_status || user.teacher_status === 'none' || user.teacher_status === 'rejected') && (
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Degree/Certificate URL *
                    </label>
                    <input
                      type="url"
                      value={verificationData.degree_url}
                      onChange={(e) => setVerificationData({ ...verificationData, degree_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/degree.pdf"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload your degree to a public URL (Google Drive, Dropbox, etc.)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={verificationData.experience_years}
                      onChange={(e) => setVerificationData({ ...verificationData, experience_years: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expertise Areas * (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={verificationData.expertise_areas}
                      onChange={(e) => setVerificationData({ ...verificationData, expertise_areas: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Web Development, React, JavaScript"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      value={verificationData.additional_info}
                      onChange={(e) => setVerificationData({ ...verificationData, additional_info: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us more about your teaching experience..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit for Verification'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
