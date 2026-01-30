import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Home, Map, Package, LogOut, Menu, X } from 'lucide-react'

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
      className={`${
        isOpen ? 'w-72' : 'w-24'
      } h-screen transition-all duration-300 flex flex-col`}
      style={{
        backgroundColor: '#ffffff',
        borderRight: '1px solid #000000',
      }}
    >
      {/* Header */}
      <div
        className="h-16 px-5 flex items-center gap-4"
        style={{
          borderBottom: '1px solid #000000',
        }}
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
        {isOpen && (
          <div className="flex items-center gap-3">
            <img src="/ecotour-logo.svg" alt="Eco Tour" className="h-8" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className={`sidebar-link ${isActive('/') ? 'sidebar-link-active' : ''} ${!isOpen ? 'justify-center' : ''}`}
            >
              <Home size={22} />
              {isOpen && <span className="font-semibold text-base">Inicio</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`sidebar-link ${isActive('/services') ? 'sidebar-link-active' : ''} ${!isOpen ? 'justify-center' : ''}`}
            >
              <Map size={22} />
              {isOpen && <span className="font-semibold text-base">Servicios</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/packages"
              className={`sidebar-link ${isActive('/packages') ? 'sidebar-link-active' : ''} ${!isOpen ? 'justify-center' : ''}`}
            >
              <Package size={22} />
              {isOpen && <span className="font-semibold text-base">Paquetes</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="p-4"
        style={{
          borderTop: '1px solid #000000',
        }}
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
