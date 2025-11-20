import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import XScore from '@/components/XScore'
import EarlyAccess from '@/components/EarlyAccess'
import Screenshots from '@/components/Screenshots'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <XScore />
      <Screenshots />
      <EarlyAccess />
      <Footer />
    </main>
  )
}

