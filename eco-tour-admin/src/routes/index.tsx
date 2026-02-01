import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
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
  X,
  Loader2,
  Search,
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
import { useTodos } from '@/features/todos/hooks/useTodos'
import { useCreateTodo, useChangeStatus } from '@/features/todos/hooks/useTodoMutations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Todo, TodoPriority, TodoFilters } from '@/types/todo.type'

// Helper para obtener colores de prioridad
const getPriorityColor = (priority: TodoPriority) => {
  switch (priority) {
    case 'hard':
      return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Alta' }
    case 'medium':
      return { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'Media' }
    case 'low':
      return { bg: '#edfff2', text: '#00932c', border: '#afffc6', label: 'Baja' }
    default:
      return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', label: 'Normal' }
  }
}

// Helper para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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
  { name: 'Privado', value: 35, color: '#3B82F6' },
  { name: 'Grupal', value: 45, color: '#22C55E' },
  { name: 'Arbitrario', value: 20, color: '#F97316' },
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


const Dashboard = () => {
  // Filtros para ToDo
  const [todoFilters, setTodoFilters] = useState<TodoFilters>({
    q: '',
    priority: '',
  })

  const { data: todos = [] as Todo[], isLoading: isLoadingTodos } = useTodos(todoFilters)
  const createTodoMutation = useCreateTodo()
  const changeStatusMutation = useChangeStatus()

  const [showAddTodo, setShowAddTodo] = useState(false)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoDescription, setNewTodoDescription] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>('medium')

  const completedCount = todos.filter((t) => t.is_completed).length
  const pendingCount = todos.filter((t) => !t.is_completed).length

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return

    await createTodoMutation.mutateAsync({
      title: newTodoTitle,
      description: newTodoDescription || undefined,
      priority: newTodoPriority,
    })

    setNewTodoTitle('')
    setNewTodoDescription('')
    setNewTodoPriority('medium')
    setShowAddTodo(false)
  }

  const handleToggleStatus = async (id: string) => {
    await changeStatusMutation.mutateAsync(id)
  }


  return (
    <div className="p-8 min-h-max">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
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
                    <stop offset="5%" stopColor="#00bf35" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00bf35" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#085f24" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#085f24" stopOpacity={0} />
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

        {/* ToDo - Tareas Pendientes (Funcional) */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: '#085f24' }}>
                <CheckCircle2 size={20} />
                Mis Tareas
              </CardTitle>
              <button
                onClick={() => setShowAddTodo(!showAddTodo)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                title="Agregar tarea"
              >
                {showAddTodo ? (
                  <X size={18} className="text-gray-500" />
                ) : (
                  <Plus size={18} className="text-gray-500" />
                )}
              </button>
            </div>
            <div className="flex gap-4 text-xs mt-2">
              <span className="text-green-600">✓ {completedCount} completadas</span>
              <span className="text-gray-500">○ {pendingCount} pendientes</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Filtros de búsqueda */}
            <div className="mb-3 space-y-2">
              <div className="relative">

                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={todoFilters.q || ''}
                  onChange={(e) => setTodoFilters((prev) => ({ ...prev, q: e.target.value }))}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setTodoFilters((prev) => ({ ...prev, priority: '' }))}
                  className={`px-2 py-0.5 text-xs rounded-full border transition ${
                    !todoFilters.priority ? 'bg-gray-200 text-gray-700' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Todas
                </button>
                {(['low', 'medium', 'hard'] as TodoPriority[]).map((p) => {
                  const colors = getPriorityColor(p)
                  const isActive = todoFilters.priority === p
                  return (
                    <button
                      key={p}
                      onClick={() => setTodoFilters((prev) => ({ ...prev, priority: isActive ? '' : p }))}
                      className={`px-2 py-0.5 text-xs rounded-full border transition ${
                        isActive ? 'ring-1 ring-offset-1 ring-gray-400' : ''
                      }`}
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.border,
                      }}
                    >
                      {colors.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Formulario para agregar tarea */}
            {showAddTodo && (
              <div className="mb-4 p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                <Input
                  placeholder="Título de la tarea"
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Descripción (opcional)"
                  value={newTodoDescription}
                  onChange={(e) => setNewTodoDescription(e.target.value)}
                  className="mb-2"
                />
                {/* Selector de prioridad */}
                <div className="flex gap-2 mb-3">
                  {(['low', 'medium', 'hard'] as TodoPriority[]).map((p) => {
                    const colors = getPriorityColor(p)
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewTodoPriority(p)}
                        className={`px-3 py-1 text-xs rounded-full border transition ${
                          newTodoPriority === p ? 'ring-2 ring-offset-1 ring-gray-400' : ''
                        }`}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text,
                          borderColor: colors.border,
                        }}
                      >
                        {colors.label}
                      </button>
                    )
                  })}
                </div>
                <Button
                  onClick={handleAddTodo}
                  disabled={!newTodoTitle.trim() || createTodoMutation.isPending}
                  className="w-full"
                  style={{ backgroundColor: '#00bf35' }}
                >
                  {createTodoMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    'Agregar Tarea'
                  )}
                </Button>
              </div>
            )}

            {/* Lista de tareas */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {isLoadingTodos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No hay tareas pendientes
                </div>
              ) : (
                todos.map((todo) => {
                  const priorityColors = getPriorityColor(todo.priority)
                  return (
                    <div
                      key={todo.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition hover:shadow-sm ${
                        todo.is_completed ? 'bg-gray-50 opacity-60' : 'bg-white'
                      }`}
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <button
                        onClick={() => handleToggleStatus(todo.id)}
                        className="mt-0.5 shrink-0"
                        disabled={changeStatusMutation.isPending}
                      >
                        {changeStatusMutation.isPending ? (
                          <Loader2 size={18} className="animate-spin text-gray-400" />
                        ) : todo.is_completed ? (
                          <CheckCircle2 size={18} style={{ color: '#00932c' }} />
                        ) : (
                          <Circle size={18} className="text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {todo.title}
                        </p>
                        {todo.description && (
                          <p className={`text-xs mt-1 ${todo.is_completed ? 'text-gray-300' : 'text-gray-500'}`}>
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: priorityColors.bg,
                              color: priorityColors.text,
                              border: `1px solid ${priorityColors.border}`,
                            }}
                          >
                            {priorityColors.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(todo.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
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
