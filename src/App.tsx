import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota padrão redireciona para o Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Nossas telas */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App