import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Settings,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Package,
  Star,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Plus,
  User
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Datos de ejemplo para los gráficos
const reservasMensuales = [
  { mes: 'Ene', reservas: 45, ingresos: 12500 },
  { mes: 'Feb', reservas: 52, ingresos: 15200 },
  { mes: 'Mar', reservas: 48, ingresos: 14100 },
  { mes: 'Abr', reservas: 70, ingresos: 21000 },
  { mes: 'May', reservas: 85, ingresos: 25500 },
  { mes: 'Jun', reservas: 92, ingresos: 28600 },
  { mes: 'Jul', reservas: 110, ingresos: 35200 },
  { mes: 'Ago', reservas: 125, ingresos: 41500 },
  { mes: 'Sep', reservas: 98, ingresos: 32000 },
  { mes: 'Oct', reservas: 88, ingresos: 27400 },
  { mes: 'Nov', reservas: 105, ingresos: 34800 },
  { mes: 'Dic', reservas: 156, ingresos: 52000 },
]

const serviciosPorTipo = [
  { name: 'Privado', value: 35, color: '#dc2626' },
  { name: 'Grupal', value: 45, color: '#00bf35' },
  { name: 'Arbitrario', value: 20, color: '#f59e0b' },
]

const destinosPopulares = [
  { destino: 'Machu Picchu', reservas: 245 },
  { destino: 'Valle Sagrado', reservas: 189 },
  { destino: 'Laguna Humantay', reservas: 156 },
  { destino: 'Montaña de Colores', reservas: 134 },
  { destino: 'Ica - Paracas', reservas: 98 },
]

const actividadReciente = [
  { id: 1, tipo: 'reserva', mensaje: 'Nueva reserva para Machu Picchu 2D/1N', tiempo: 'Hace 5 min', icono: Calendar },
  { id: 2, tipo: 'usuario', mensaje: 'Nuevo usuario registrado: Juan Pérez', tiempo: 'Hace 15 min', icono: Users },
  { id: 3, tipo: 'pago', mensaje: 'Pago recibido: S/. 1,250.00', tiempo: 'Hace 30 min', icono: DollarSign },
  { id: 4, tipo: 'servicio', mensaje: 'Servicio actualizado: Valle Sagrado Full Day', tiempo: 'Hace 1 hora', icono: Package },
  { id: 5, tipo: 'review', mensaje: 'Nueva reseña 5 estrellas recibida', tiempo: 'Hace 2 horas', icono: Star },
]

const proximosViajes = [
  { id: 1, servicio: 'Machu Picchu 2D/1N', fecha: '30 Ene 2026', pasajeros: 8, guia: 'Carlos Mendoza' },
  { id: 2, servicio: 'Valle Sagrado Full Day', fecha: '31 Ene 2026', pasajeros: 12, guia: 'María García' },
  { id: 3, servicio: 'Laguna Humantay', fecha: '01 Feb 2026', pasajeros: 6, guia: 'Pedro Quispe' },
  { id: 4, servicio: 'Montaña de Colores', fecha: '02 Feb 2026', pasajeros: 10, guia: 'Ana Torres' },
]

// Datos de ejemplo para ToDo (maqueta)
const tareasPendientes = [
  { id: 1, title: 'Confirmar reserva Machu Picchu grupo 12 pax', completed: false, assignee: 'Carlos M.', priority: 'alta', dueDate: '30 Ene' },
  { id: 2, title: 'Actualizar precios temporada alta', completed: true, assignee: 'Admin', priority: 'media', dueDate: '28 Ene' },
  { id: 3, title: 'Responder consultas pendientes (5)', completed: false, assignee: 'María G.', priority: 'alta', dueDate: '29 Ene' },
  { id: 4, title: 'Subir fotos nuevas Valle Sagrado', completed: false, assignee: 'Pedro Q.', priority: 'baja', dueDate: '02 Feb' },
  { id: 5, title: 'Verificar disponibilidad guías febrero', completed: false, assignee: 'Admin', priority: 'media', dueDate: '31 Ene' },
  { id: 6, title: 'Enviar itinerario cliente VIP', completed: true, assignee: 'Ana T.', priority: 'alta', dueDate: '27 Ene' },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
    case 'media': return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' }
    case 'baja': return { bg: '#edfff2', text: '#00932c', border: '#afffc6' }
    default: return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' }
  }
}

const Dashboard = () => {
  return (
    <div className="p-8" style={{ backgroundColor: '#fafafa', minHeight: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#085f24' }}>
          Bienvenido a Eco Tour Admin
        </h1>
        <p className="text-gray-600">
          Panel de administración del sistema - Resumen general
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Servicios
            </CardTitle>
            <Settings size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>24</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight size={14} />
              <span>+3 este mes</span>
            </div>
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
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>1,248</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight size={14} />
              <span>+12% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Reservas del Mes
            </CardTitle>
            <Calendar size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>156</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight size={14} />
              <span>+18% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos del Mes
            </CardTitle>
            <TrendingUp size={20} style={{ color: '#00bf35' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: '#085f24' }}>S/. 52,000</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight size={14} />
              <span>+8% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Reservas e Ingresos */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#085f24' }}>
              Reservas e Ingresos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reservasMensuales}>
                <defs>
                  <linearGradient id="colorReservas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00bf35" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00bf35" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#085f24" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#085f24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="reservas"
                  stroke="#00bf35"
                  fillOpacity={1}
                  fill="url(#colorReservas)"
                  name="Reservas"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#085f24"
                  strokeWidth={2}
                  dot={{ fill: '#085f24' }}
                  name="Ingresos (S/.)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Servicios por Tipo */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#085f24' }}>
              Distribución por Tipo de Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviciosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviciosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Destinos Populares */}
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#085f24' }}>
              <MapPin size={20} />
              Destinos Más Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={destinosPopulares} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="destino" type="category" stroke="#6b7280" fontSize={12} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="reservas" fill="#00bf35" radius={[0, 4, 4, 0]} name="Reservas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ToDo - Tareas Pendientes (Maqueta) */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#085f24' }}>
                <CheckCircle2 size={20} />
                Tareas Pendientes
              </CardTitle>
              <button
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                title="Agregar tarea (próximamente)"
              >
                <Plus size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="flex gap-4 text-xs mt-2">
              <span className="text-green-600">✓ 2 completadas</span>
              <span className="text-gray-500">○ 4 pendientes</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {tareasPendientes.map((tarea) => {
                const priorityColors = getPriorityColor(tarea.priority)
                return (
                  <div
                    key={tarea.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer hover:shadow-sm ${
                      tarea.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
                    }`}
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {tarea.completed ? (
                        <CheckCircle2 size={18} style={{ color: '#00932c' }} />
                      ) : (
                        <Circle size={18} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${tarea.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {tarea.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: priorityColors.bg,
                            color: priorityColors.text,
                            border: `1px solid ${priorityColors.border}`
                          }}
                        >
                          {tarea.priority}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <User size={12} />
                          {tarea.assignee}
                        </span>
                        <span className="text-xs text-gray-400">
                          {tarea.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tercera fila: Actividad y Próximos viajes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#085f24' }}>
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actividadReciente.map((actividad) => (
                <div key={actividad.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: '#edfff2' }}
                  >
                    <actividad.icono size={16} style={{ color: '#00932c' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{actividad.mensaje}</p>
                    <p className="text-xs text-gray-400">{actividad.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Viajes */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#085f24' }}>
              <Calendar size={20} />
              Próximos Viajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-medium">Servicio</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Fecha</th>
                    <th className="text-center py-2 text-gray-600 font-medium">Pax</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Guía</th>
                  </tr>
                </thead>
                <tbody>
                  {proximosViajes.map((viaje) => (
                    <tr key={viaje.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium" style={{ color: '#085f24' }}>
                        {viaje.servicio}
                      </td>
                      <td className="py-3 text-gray-600">{viaje.fecha}</td>
                      <td className="py-3 text-center">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#edfff2', color: '#00932c' }}
                        >
                          {viaje.pasajeros}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{viaje.guia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Dashboard,
})
