export type TodoPriority = 'low' | 'medium' | 'hard'

export interface Todo {
  id: string
  title: string
  description: string
  is_completed: boolean
  priority: TodoPriority
  user: number
  created_at: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  priority?: TodoPriority
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  priority?: TodoPriority
}
