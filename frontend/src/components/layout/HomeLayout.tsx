import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const HERO_HEIGHT = 560 // px — roughly the hero section height

export default function HomeLayout() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > HERO_HEIGHT - 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Header overlays the hero when at top, becomes opaque on scroll */}
      <div className="absolute inset-x-0 top-0 z-20">
        <Header transparent={!scrolled} />
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
