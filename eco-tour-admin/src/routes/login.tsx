import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (!username || !password) {
      setLocalError('Usuario y contraseña son requeridos')
      return
    }

    setIsLoading(true)
    login(
      { username, password },
      {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: (err: any) => {
          setIsLoading(false)
          setLocalError(err?.message || 'Error al iniciar sesión')
        },
      },
    )
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: '#ffffff' }}
    >
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/ecotour-logo.svg" alt="Eco Tour" className="h-16" />
          </div>
          <CardDescription>
            Inicia sesión en tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {(error || localError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error || localError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
              style={{
                backgroundColor: '#085f24',
                color: '#ffffff',
              }}
            >
              {isLoading ? 'Cargando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
