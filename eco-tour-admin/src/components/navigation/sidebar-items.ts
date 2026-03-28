import { Home, Map, Package, User, FileText, UsersRound } from 'lucide-react'

export const SIDEBAR_ITEMS = [
  { label: 'Inicio', to: '/', icon: Home },
  { label: 'Servicios', to: '/services', icon: Map },
  { label: 'Paquetes', to: '/packages', icon: Package },
  { label: 'Cotizaciones', to: '/quotes', icon: FileText },
  { label: 'Clientes', to: '/persons', icon: User },
  { label: 'Grupos', to: '/groups', icon: UsersRound },
]
