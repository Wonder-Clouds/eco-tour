export interface Auth {
  username: string,
  password: string
}

export interface GetToken {
  refresh: string,
  access: string
}

export interface RefreshToken {
  refresh: string
}

export interface VerifyToken {
  token: string
}

export interface AccessToken{
  access: string
}

export interface AuthContextType {
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  login: (credentials: Auth) => Promise<void>
  logout: () => void
}