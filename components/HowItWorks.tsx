export default function HowItWorks() {
  const steps = [
    {
      icon: '🚀',
      title: 'Sign Up',
      description: 'Get 2 credits instantly when you join.',
    },
    {
      icon: '🎓',
      title: 'Learn or Teach',
      description: 'Spend credits to learn. Teach to earn credits.',
    },
    {
      icon: '⭐',
      title: 'Grow Your XScore',
      description: 'Your engagement score reflects how active you are.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-6xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 text-lg">{step.description}</p>
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

