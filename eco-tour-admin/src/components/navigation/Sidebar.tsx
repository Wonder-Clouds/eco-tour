import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LogOut, Menu, X } from 'lucide-react'
import { SIDEBAR_ITEMS } from './sidebar-items'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
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
      className={`bg-[#F0FFDF] ${isOpen ? 'w-68' : 'w-24'
        } h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div
        className="h-16 px-5 border-b border-gray-300 flex items-center gap-4"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-lg transition-all duration-200"
          style={{
            color: '#000000',
            backgroundColor: hoveredItem === 'menu' ? '#e5e7eb' : 'transparent',
          }}
          onMouseEnter={() => setHoveredItem('menu')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 gap-10 flex flex-col">
        {
          isOpen ? (
            <div className="flex items-center gap-3 mx-4">
              <img src="/ecotour-logo.svg" alt="Eco Tour" className="h-12" />
            </div>
          ) : (
            <div className="flex items-center gap-3 mx-4">
              <img src="/icon.png" alt="Eco Tour" className="h-8" />
            </div>
          )
        }
        <ul className="space-y-3">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`sidebar-link ${isActive(item.to) ? 'sidebar-link-active' : ''} ${!isOpen ? 'justify-center' : ''}`}
                >
                  <Icon size={22} />
                  {isOpen && (
                    <span className="font-semibold text-base">{item.label}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

      </nav>

      {/* Footer */}
      <div
        className="p-4"
      >
        <button
          onClick={() => logout()}
          className={`flex items-center gap-4 w-full px-4 py-4 rounded-lg transition-all duration-200 font-semibold ${!isOpen ? 'justify-center' : ''}`}
          style={{
            color: '#dc2626',
            backgroundColor: hoveredItem === 'logout' ? '#fef2f2' : 'transparent',
          }}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <LogOut size={22} />
          {isOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  )
}
