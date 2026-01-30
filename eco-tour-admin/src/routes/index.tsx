import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Settings, Users, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: '#085f24' }}
        >
          Bienvenido a Eco Tour Admin
        </h1>
        <p className="text-gray-600">
          Panel de administración del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Servicios
            </CardTitle>
            <Settings size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>12</div>
            <p className="text-xs text-gray-500">+2 este mes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usuarios Activos
            </CardTitle>
            <Users size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>48</div>
            <p className="text-xs text-gray-500">+5 esta semana</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reservas
            </CardTitle>
            <Home size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>156</div>
            <p className="text-xs text-gray-500">+12% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos
            </CardTitle>
            <TrendingUp size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>S/. 24,500</div>
            <p className="text-xs text-gray-500">+8% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Dashboard,
})
