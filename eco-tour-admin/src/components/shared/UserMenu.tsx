import { Bell, User } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle";

const UserMenu = () => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
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
  )
}

export default UserMenu;