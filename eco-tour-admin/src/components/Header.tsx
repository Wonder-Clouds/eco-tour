import { Bell } from 'lucide-react'

export default function Header() {
  // Mock de usuario logueado
  const user = {
    name: 'Admin Usuario',
    role: 'Administrador',
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="h-16 px-6 flex items-center justify-end bg-white border-b border-gray-200">
      {/* Acciones del header */}
      <div className="flex items-center gap-4">
        {/* Notificaciones */}
        <button
          className="relative p-2.5 rounded-full transition-all hover:bg-gray-100"
          title="Notificaciones"
        >
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
        </button>

        {/* Separador */}
        <div className="h-8 w-px bg-gray-200" />

        {/* Info del usuario */}
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: '#00932c' }}
          >
            {getInitials(user.name)}
          </div>

          {/* Info */}
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
