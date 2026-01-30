import React from 'react'
import {
  HeadContent,
  Scripts,
  createRootRoute,
  Navigate,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { useAuth } from '@/features/auth/hooks/useAuth'

import appCss from '../styles.css?url'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Eco Tour Admin',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <RootLayout>{children}</RootLayout>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const isLoginPage = router.state.location.pathname === '/login'

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Durante SSR, mostrar loading
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    )
  }

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" />
  }

  if (isLoginPage) {
    return children
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
