// src/components/ThemeToggle.tsx
import { useTheme } from '@/hooks/useTheme'
import { Moon, Sun } from 'lucide-react' // o usa emojis si prefieres

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  )
}