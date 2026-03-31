import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, BarChart3, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'

// 1. Definimos as regras de validação com o Zod
const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

// Tipagem extraída automaticamente do Zod
type LoginFormInputs = z.infer<typeof loginSchema>

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useContext(AuthContext) // Trazemos a função do nosso Cofre
  const navigate = useNavigate() // Para redirecionar de tela

  // 2. Iniciamos o React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  // 3. Função que roda ao clicar em "Entrar"
  async function handleLogin(data: LoginFormInputs) {
    try {
      // 1. Batendo na rota de login do Java
      const response = await api.post('/api/v1/auth/login', {
        email: data.email,
        password: data.password,
      })

      // 2. Extraímos o Token
      const token = response.data.token

      if (!token) {
        throw new Error("Token não retornado pela API")
      }

      // 3. Avisamos o Axios para usar esse token nas próximas viagens
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      // 4. Buscamos o usuário completo na rota /me para guardar no Contexto
      const userResponse = await api.get('/api/v1/users/me')
      const user = userResponse.data

      // 5. Guardamos tudo no nosso cofre
      signIn(token, user)

      // 6. Sucesso! Redirecionamos para o Dashboard
      navigate('/dashboard')
      
    } catch (error: any) {
      console.error("Erro no login:", error)
      
      // Pega a mensagem tratada da sua BusinessException do Java (se houver)
      const errorMessage = error.response?.data?.message || 'E-mail ou senha incorretos. Tente novamente.'
      
      setError('root', {
        message: errorMessage
      })
    }
  }

  return (
    <div className="min-h-screen w-full flex font-sans text-[#F5F5F5] bg-[#0B0B0F] overflow-hidden relative">
      
      {/* HEADER TOP */}
      <header className="absolute top-0 w-full h-24 flex items-center justify-between px-8 lg:px-16 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/[0.05] rounded-xl border border-white/10 backdrop-blur-md">
            <BarChart3 className="w-6 h-6 text-[#6C63FF]" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(108,99,255,0.5)]">
            Aurum Finance
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">Produto</a>
          <a href="#" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">Features</a>
          <button className="px-6 py-2.5 bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/50 rounded-xl text-sm font-bold hover:bg-[#6C63FF] hover:text-white transition-all shadow-[0_0_20px_rgba(108,99,255,0.2)] hover:shadow-[0_0_30px_rgba(108,99,255,0.6)]">
            Crie sua Conta
          </button>
        </div>
      </header>

      {/* 🟣 LADO ESQUERDO - Formulário "Glass Card" */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 relative z-10 mt-16 lg:mt-0">
        
        <div className="w-full max-w-[440px] bg-white/[0.02] border border-white/10 p-10 sm:p-12 rounded-[2rem] shadow-2xl backdrop-blur-xl">
          
          <div className="mb-10">
            <h2 className="font-heading text-[28px] font-bold tracking-tight mb-2 text-white">Acesse sua Carteira</h2>
            <p className="text-[#A1A1AA] text-sm">Insira suas credenciais corporativas.</p>
          </div>

          {/* O form agora intercepta o envio com o handleSubmit */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            
            {/* Input E-mail */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">E-mail corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#6C63FF]/70" />
                </div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')} // <-- Conectando o input ao React Hook Form
                  className={`w-full pl-11 pr-4 py-3.5 bg-[#050508] border ${errors.email ? 'border-red-500' : 'border-white/5'} rounded-xl text-white placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF]/50 transition-all shadow-inner`}
                />
              </div>
              {/* Mensagem de Erro do Zod */}
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Input Senha */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Senha de acesso</label>
                <a href="#" className="text-xs text-[#6C63FF] hover:text-white hover:underline transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#6C63FF]/70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register('password')} // <-- Conectando o input ao React Hook Form
                  className={`w-full pl-11 pr-12 py-3.5 bg-[#050508] border ${errors.password ? 'border-red-500' : 'border-white/5'} rounded-xl text-white placeholder-[#A1A1AA]/40 focus:outline-none focus:border-[#6C63FF] focus:ring-1 focus:ring-[#6C63FF]/50 transition-all shadow-inner`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A1A1AA] hover:text-[#6C63FF] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Mensagem de Erro do Zod */}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Mensagem de erro da API (Credenciais inválidas) */}
            {errors.root && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
                {errors.root.message}
              </div>
            )}

            {/* Botão de Submit com Loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-4 bg-[#6C63FF] text-white font-heading font-bold text-lg rounded-xl transition-all hover:bg-[#8079ff] hover:scale-[1.02] active:scale-[0.98] hover-animista-shadow mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Entrar'}
            </button>
          </form>

          {/* Rodapé do Form */}
          <div className="mt-8 text-center">
            <p className="text-[#A1A1AA] text-sm">
              Não possui credenciais?{' '}
              <a href="#" className="text-[#6C63FF] font-semibold hover:text-white hover:underline transition-colors">
                Crie seu acesso agora
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* 🟣 LADO DIREITO - O GLOW NEON E A PLACA DE VIDRO */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center bg-[#050508] border-l border-white/5 overflow-hidden">
        
        {/* Background da Cidade (Com overlay escuro) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-[#0B0B0F]" />
        
        {/* Luzes Neon Flutuantes (Os orbs de energia) */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#6C63FF]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#22C55E]/10 rounded-full blur-[100px]" />

        {/* 🏆 A PLACA DE VIDRO (Simulação 3D com bordas asimétricas) */}
        <div className="relative z-10 w-full max-w-[500px] backdrop-blur-2xl bg-white/[0.03] border-t border-l border-white/30 border-b border-r border-white/5 p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
          
          {/* Brilho interno do vidro */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />

          {/* Conteúdo da Placa */}
          <div className="relative z-20">
            <h3 className="text-white/70 text-sm font-medium mb-1 tracking-widest uppercase">Patrimônio Total</h3>
            <div className="text-6xl font-bold text-white tracking-tighter mb-2 drop-shadow-lg">
              € 1.250.000,00
            </div>
            <div className="text-[#22C55E] text-sm font-semibold tracking-wide drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
              +15.8% (Mês)
            </div>

            {/* O Gráfico SVG Glowing Neon */}
            <div className="mt-12 relative">
              <svg className="w-full h-40 overflow-visible" viewBox="0 0 200 100">
                <defs>
                  <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8079ff" />
                    <stop offset="50%" stopColor="#c4b5fd" />
                    <stop offset="100%" stopColor="#6C63FF" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <path 
                  d="M0 80 C 30 80, 40 40, 80 50 C 110 60, 140 10, 200 15" 
                  fill="none" 
                  stroke="url(#neonGlow)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  filter="url(#glow)"
                />
                
                <path 
                  d="M0 80 C 30 80, 40 40, 80 50 C 110 60, 140 10, 200 15" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  className="opacity-70"
                />
                
                <polygon points="190,5 205,15 195,25" fill="#c4b5fd" filter="url(#glow)" />
              </svg>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  )
}