import { Bell } from 'lucide-react'

const UserMenu = () => {
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
    <div className="flex items-center gap-3">

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
      <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
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
  )
}

export default UserMenu
