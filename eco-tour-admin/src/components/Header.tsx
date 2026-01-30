import { Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header
      className="h-16 px-4 flex items-center justify-end"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #000000',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-lg transition hover:bg-gray-100"
          style={{ color: '#eab308' }}
        >
          <Bell size={20} />
        </button>
        <button
          className="p-2 rounded-lg transition hover:bg-gray-100"
          style={{ color: '#000000' }}
        >
          <User size={20} />
        </button>
      </div>
    </header>
  )
}
