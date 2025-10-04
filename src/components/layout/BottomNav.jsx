import { NavLink } from 'react-router-dom'
import { Home, BarChart3, User } from 'lucide-react'

export default function BottomNav() {
  const links = [
    { to: '/attendance', icon: Home, label: 'Home' },
    { to: '/summary', icon: BarChart3, label: 'Summary' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 px-6 py-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary-600 dark:text-primary-300' : 'text-gray-400 dark:text-gray-300'
              }`
            }
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}