import axiosInstance from '@/config/axios'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types/todo.type'

const API_URL = '/todo'

export async function getTodos(): Promise<Todo[]> {
  const response = await axiosInstance.get<Todo[]>(API_URL + '/')
  return response.data
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
