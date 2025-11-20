'use client'
import Image from 'next/image'

export default function Screenshots() {
  const screenshots = [
    {
      title: 'Dashboard',
      description: 'Track your credits, sessions, and XScore',
      image: '/screenshots/dashboard.png',
    },
    {
      title: 'Skill Cards',
      description: 'Browse available skills to learn or teach',
      image: '/screenshots/skills.png',
    },
    {
      title: 'Credit Balance',
      description: 'Manage your credits and transactions',
      image: '/screenshots/credits.png',
    },
    {
      title: 'XScore Progress',
      description: 'Watch your reputation grow',
      image: '/screenshots/xscore.png',
    },
    {
      title: 'Session Scheduling',
      description: 'Book and manage your learning sessions',
      image: '/screenshots/sessions.png',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">
          See XSkill in Action
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={screenshot.image}
                  alt={screenshot.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to gradient if image doesn't exist
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                          <div class="text-white text-center">
                            <div class="text-4xl mb-2">📱</div>
                            <div class="text-xl font-semibold">${screenshot.title}</div>
                          </div>
                        </div>
                      `
                    }
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{screenshot.title}</h3>
                <p className="text-gray-600">{screenshot.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

