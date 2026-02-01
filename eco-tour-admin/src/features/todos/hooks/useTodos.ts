import { useQuery } from '@tanstack/react-query'
import { getTodos } from '../api/todosApi'
import { Todo } from '@/types/todo.type'

export const useTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: getTodos,
  })
}
