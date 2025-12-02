'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Course } from '@/lib/types'
import { BookOpen, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses((data as Course[]) || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))]
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
          <p className="text-gray-600 mt-1">Discover skills you want to learn</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff} className="capitalize">
                  {diff === 'all' ? 'All Levels' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCourses.length}</span> of <span className="font-semibold">{courses.length}</span> courses
          </p>
          {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedDifficulty('all')
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/dashboard/courses/${course.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-200 hover:border-primary-300"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
                {course.image_url ? (
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="w-16 h-16 text-primary-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  } capitalize`}>
                    {course.difficulty}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full font-medium">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500">{course.duration_minutes} min</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {course.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{course.total_enrollments || 0} enrolled</span>
                    {course.average_rating > 0 && (
                      <span>⭐ {course.average_rating.toFixed(1)}</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-primary-600 group-hover:text-primary-700">
                    View Course →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
