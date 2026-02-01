import { useState, useRef, useEffect } from 'react'
import { Bell, StickyNote, Plus, CheckCircle2, Circle, Loader2, X, Pencil } from 'lucide-react'
import { useTodos } from '@/features/todos/hooks/useTodos'
import { useCreateTodo, useChangeStatus, useUpdateTodo } from '@/features/todos/hooks/useTodoMutations'
import { Todo, TodoPriority } from '@/types/todo.type'

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

  // Estado del panel de ToDo
  const [showTodoPanel, setShowTodoPanel] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [newTodoDescription, setNewTodoDescription] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>('medium')

  const panelRef = useRef<HTMLDivElement>(null)

  // Hooks de ToDo
  const { data: todos = [] as Todo[], isLoading } = useTodos()
  const createTodoMutation = useCreateTodo()
  const changeStatusMutation = useChangeStatus()
  const updateTodoMutation = useUpdateTodo()

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowTodoPanel(false)
        resetForm()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const resetForm = () => {
    setShowCreateForm(false)
    setEditingTodo(null)
    setNewTodoTitle('')
    setNewTodoDescription('')
    setNewTodoPriority('medium')
  }

  const handleCreateTodo = async () => {
    if (!newTodoTitle.trim()) return
    await createTodoMutation.mutateAsync({
      title: newTodoTitle,
      description: newTodoDescription || undefined,
      priority: newTodoPriority,
    })
    resetForm()
  }

  const handleUpdateTodo = async () => {
    if (!editingTodo || !newTodoTitle.trim()) return
    await updateTodoMutation.mutateAsync({
      id: editingTodo.id,
      data: {
        title: newTodoTitle,
        description: newTodoDescription,
        priority: newTodoPriority,
      },
    })
    resetForm()
  }

  const startEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTodoTitle(todo.title)
    setNewTodoDescription(todo.description || '')
    setNewTodoPriority(todo.priority || 'medium')
    setShowCreateForm(false)
  }

  const pendingCount = todos.filter((t) => !t.is_completed).length

  return (
    <header className="h-16 px-6 flex items-center justify-end bg-white border-b border-gray-200 shrink-0">
      {/* Acciones del header */}
      <div className="flex items-center gap-3">
        {/* Botón de ToDo con dropdown */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowTodoPanel(!showTodoPanel)}
            className={`relative p-2.5 rounded-full transition-all group ${
              showTodoPanel ? 'bg-green-100' : 'hover:bg-green-50'
            }`}
            title="Mis tareas"
          >
            <StickyNote size={20} className={`${showTodoPanel ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'}`} />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>

          {/* Panel desplegable de ToDo */}
          {showTodoPanel && (
            <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
              {/* Header del panel */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Mis Tareas</h3>
                  <p className="text-xs text-gray-500">{pendingCount} pendientes</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(true)
                    setEditingTodo(null)
                    setNewTodoTitle('')
                    setNewTodoDescription('')
                    setNewTodoPriority('medium')
                  }}
                  className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                  title="Nueva tarea"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Formulario de crear/editar */}
              {(showCreateForm || editingTodo) && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      {editingTodo ? 'Editar tarea' : 'Nueva tarea'}
                    </span>
                    <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Título de la tarea"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <textarea
                    placeholder="Descripción (opcional)"
                    value={newTodoDescription}
                    onChange={(e) => setNewTodoDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows={2}
                  />
                  <div className="flex gap-1.5 mb-3">
                    {(['low', 'medium', 'hard'] as TodoPriority[]).map((p) => {
                      const colors = getPriorityColor(p)
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewTodoPriority(p)}
                          className={`px-2.5 py-1 text-xs rounded-full border transition ${
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
                  <button
                    onClick={editingTodo ? handleUpdateTodo : handleCreateTodo}
                    disabled={!newTodoTitle.trim() || createTodoMutation.isPending || updateTodoMutation.isPending}
                    className="w-full py-2 rounded-lg text-white text-sm font-medium transition disabled:opacity-50"
                    style={{ backgroundColor: '#00bf35' }}
                  >
                    {(createTodoMutation.isPending || updateTodoMutation.isPending) ? (
                      <Loader2 className="animate-spin mx-auto" size={16} />
                    ) : editingTodo ? (
                      'Actualizar'
                    ) : (
                      'Crear tarea'
                    )}
                  </button>
                </div>
              )}

              {/* Lista de tareas */}
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-gray-400" size={24} />
                  </div>
                ) : todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No hay tareas
                  </div>
                ) : (
                  todos.map((todo) => {
                    const priorityColors = getPriorityColor(todo.priority)
                    return (
                      <div
                        key={todo.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${
                          todo.is_completed ? 'opacity-50' : ''
                        }`}
                      >
                        <button
                          onClick={() => changeStatusMutation.mutate(todo.id)}
                          className="mt-0.5 shrink-0"
                          disabled={changeStatusMutation.isPending}
                        >
                          {todo.is_completed ? (
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
                            <p className="text-xs text-gray-500 truncate">{todo.description}</p>
                          )}
                          <span
                            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: priorityColors.bg,
                              color: priorityColors.text,
                              border: `1px solid ${priorityColors.border}`,
                            }}
                          >
                            {priorityColors.label}
                          </span>
                        </div>
                        <button
                          onClick={() => startEditTodo(todo)}
                          className="p-1 rounded hover:bg-gray-200 transition text-gray-400 hover:text-gray-600"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

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
    </header>
  )
}
