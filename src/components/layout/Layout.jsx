import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pb-20">
      <main className="container mx-auto px-4 py-6 max-w-md">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}