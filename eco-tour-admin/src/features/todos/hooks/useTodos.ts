import { useQuery } from '@tanstack/react-query'
import { getTodos } from '../api/todosApi'
import { Todo, TodoFilters } from '@/types/todo.type'

export const useTodos = (filters?: TodoFilters) => {
  return useQuery<Todo[]>({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
  })
}
