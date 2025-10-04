import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'

  const toggle = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      className="h-9 rounded-xl px-3 gap-2 bg-white dark:bg-neutral-800 text-black dark:text-neutral-100 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-neutral-700"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="text-xs font-medium">Dark</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="text-xs font-medium">Light</span>
        </>
      )}
    </Button>
  )
}