import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
