export default function Features() {
  const features = [
    {
      icon: '👥',
      title: 'Peer-to-Peer Learning',
      description: 'Connect directly with skilled individuals in your community. Learn from real people with real experience.',
    },
    {
      icon: '🔄',
      title: 'Flexible Skill Exchange',
      description: 'Teach any skill you master. Learn anything you desire. Complete flexibility in what you share and learn.',
    },
    {
      icon: '💰',
      title: 'Affordable Credit System',
      description: 'No subscription fees. Pay only for what you learn. Earn credits by teaching others.',
    },
    {
      icon: '💳',
      title: 'Teacher Credit Cashout',
      description: 'Convert your earned credits into real value. Cash out your teaching rewards.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50/50 to-accent-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">
          Why Choose XSkill?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

