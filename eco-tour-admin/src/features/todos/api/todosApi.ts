import axiosInstance from '@/config/axios'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters } from '@/types/todo.type'

const API_URL = '/todo'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export async function getTodos(filters?: TodoFilters): Promise<Todo[]> {
  const params = new URLSearchParams()

  if (filters?.q) {
    params.append('q', filters.q)
  }
  if (filters?.priority) {
    params.append('priority', filters.priority)
  }

  const queryString = params.toString()
  const url = queryString ? `${API_URL}/?${queryString}` : `${API_URL}/`

  const response = await axiosInstance.get<PaginatedResponse<Todo> | Todo[]>(url)

  // Handle both paginated and array responses
  if (Array.isArray(response.data)) {
    return response.data
  }

  // If paginated response
  if (response.data && 'results' in response.data) {
    return response.data.results
  }

  return []
}

export async function createTodo(data: CreateTodoInput): Promise<Todo> {
  const response = await axiosInstance.post<Todo>(API_URL + '/', data)
  return response.data
}

export async function updateTodo(id: string, data: UpdateTodoInput): Promise<Todo> {
  const response = await axiosInstance.patch<Todo>(`${API_URL}/${id}/`, data)
  return response.data
}

export async function changeStatus(id: string): Promise<Todo> {
  const response = await axiosInstance.post<Todo>(`${API_URL}/${id}/change-status/`)
  return response.data
}

export async function deleteTodo(id: string): Promise<void> {
  await axiosInstance.delete(`${API_URL}/${id}/`)
}
