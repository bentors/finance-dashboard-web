import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { api } from '../services/api'

// 1. Formato dos dados do Usuário
interface User {
  id: string
  name: string
  email: string
}

// 2. O Cofre guarda e quais funções ele vai expor
interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  signIn: (token: string, userData: User) => void
  signOut: () => void
}

// 3. Contexto vazio
export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

// 4. Provedor
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Quando o site carregar, busca o token no armazenamento do navegador
  useEffect(() => {
    const token = localStorage.getItem('@FinanceDashboard:token')
    const storedUser = localStorage.getItem('@FinanceDashboard:user')

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
      // Avisa o Axios para colocar o crachá
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
  }, [])

  // Função que a tela de Login vai chamar quando o Java disser "Acesso Permitido"
  function signIn(token: string, userData: User) {
    localStorage.setItem('@FinanceDashboard:token', token)
    localStorage.setItem('@FinanceDashboard:user', JSON.stringify(userData))
    
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setUser(userData)
  }

  // Função que o botão "Sair" vai chamar
  function signOut() {
    localStorage.removeItem('@FinanceDashboard:token')
    localStorage.removeItem('@FinanceDashboard:user')
    
    delete api.defaults.headers.common.Authorization
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}