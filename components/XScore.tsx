'use client'

export default function XScore() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
              Your <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">XScore</span>
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              XScore is your exchange activity score. It increases based on teaching, learning, reliability, and engagement. This creates a reputation system that rewards consistency.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-gray-700">Teaching sessions completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                <span className="text-gray-700">Learning sessions attended</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary-400 rounded-full"></div>
                <span className="text-gray-700">Session reliability rate</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                <span className="text-gray-700">Community engagement</span>
              </div>
            </div>
          </div>
          
          {/* XScore Gauge Mockup */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="url(#gradient)"
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 100}`}
                  strokeDashoffset={`${2 * Math.PI * 100 * 0.3}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                    7.2
                  </div>
                  <div className="text-gray-600 mt-2">XScore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

