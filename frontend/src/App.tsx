import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProgressHydration } from './hooks/useProgress'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ProgressHydration() {
  useProgressHydration()
  return null
}
import HomeLayout from './components/layout/HomeLayout'
import AppLayout from './components/layout/AppLayout'
import LessonLayout from './components/layout/LessonLayout'
import { useAuthStore } from './store/authStore'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import LearnBasics from './pages/LearnBasics'
import LessonDetail from './pages/LessonDetail'
import Openings from './pages/Openings'
import Puzzles from './pages/Puzzles'
import Profile from './pages/Profile'
import AuthModal from './components/ui/AuthModal'

function HomeOrRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/home" replace />
  return <Home />
}

function App() {
  useAuth() // Restore session from token on load so progress hydration can run when authenticated
  return (
    <>
    <ScrollToTop />
    <ProgressHydration />
    <AuthModal />
    <Routes>
      {/* Home: marketing landing for guests; redirect authenticated users to dashboard */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomeOrRedirect />} />
      </Route>

      {/* Lesson detail — header only, no sidebar */}
      <Route element={<LessonLayout />}>
        <Route path="learn/:lessonId" element={<LessonDetail />} />
      </Route>

      {/* Inner app pages — header + sidebar */}
      <Route element={<AppLayout />}>
        <Route path="home" element={<Dashboard />} />
        <Route path="learn" element={<LearnBasics />} />
        <Route path="openings" element={<Openings />} />
        <Route path="puzzles" element={<Puzzles />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
