import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LogOut } from 'lucide-react'
import { SIDEBAR_ITEMS } from './sidebar-items'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const currentPath = router.state.location.pathname
  const isLoginPage = currentPath === '/login'

  if (!isAuthenticated || isLoginPage) return null

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(path)
  }

  return (
    <aside
      className={`bg-background ${isOpen ? 'w-64' : 'w-20'} h-screen transition-all duration-300 flex flex-col border-r border-gray-200`}
    >
      {/* Header con Logo */}
      <div className="h-16 px-4 flex items-center border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 flex items-center gap-3"
        >
          {isOpen ? (
            <img src="/ecotour-logo.svg" alt="Eco Tour" className="h-8" />
          ) : (
            <img src="/icon.png" alt="Eco Tour" className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 font-medium
                    ${!isOpen ? 'justify-center' : ''}
                    ${active
                      ? 'bg-[#00bf35] text-white shadow-md hover:bg-[#00932c]'
                      : 'text-gray-600 hover:bg-[#d6ffe2] hover:text-[#085f24]'
                    }
                  `}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon size={20} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3">
        <button
          onClick={() => logout()}
          className={`
            flex items-center gap-3 w-full px-4 py-3 rounded-lg
            transition-all duration-200 font-medium
            text-red-600 hover:bg-red-50
            ${!isOpen ? 'justify-center' : ''}
          `}
          title={!isOpen ? 'Cerrar Sesión' : undefined}
        >
          <LogOut size={20} />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
}
