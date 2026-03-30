import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

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
      className="flex items-center justify-center h-screen"
    >
      <div className="w-1/2 p-18 h-full bg-[url('/bg-login.png')] bg-cover flex flex-col gap-10">
        {/* Header */}
        <div className="">
          {/* Icono base en gris claro */}
          <img
            src="/icon.png"
            alt="Loading"
            className="inset-0 h-12"
            style={{
              filter: 'brightness(1.8) saturate(0)',
              opacity: 0.3,
            }}
          />
        </div>
        <div className="flex flex-col justify-center h-full text-white">
          <h2 className="text-8xl font-extrabold mb-24">Bienvenido de vuelta!</h2>
        </div>
      </div>
      <div className="w-1/2 p-30 flex flex-col justify-center h-full gap-15">
        <div className="space-y-5">
          <h1 className="text-5xl font-bold text-foreground">Iniciar sesión</h1>
          <span className="text-xl">Bienvenido de vuelta! Por favor inicia sesión con tu cuenta.</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label className="text-2xl" htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full py-6 text-base!"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-2xl" htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full py-6 text-base!"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" disabled={isLoading} />
            <Label className="text-base" htmlFor="remember-me">Recuérdame</Label>
          </div>

          {(error || localError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error || localError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary cursor-pointer py-7 text-base"
            size="lg"
          >
            {isLoading ? 'Cargando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
