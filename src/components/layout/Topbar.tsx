import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Bell, Search } from 'lucide-react'

export function Topbar() {
  const { user } = useContext(AuthContext)

  return (
    <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 sm:px-12 shrink-0 bg-[#0B0B0F]">
      {/* Título da Página (Poderíamos passar via Props depois!) */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-[#A1A1AA] text-sm">Acompanhe seus rendimentos e despesas.</p>
      </div>

      {/* Ferramentas e Perfil */}
      <div className="flex items-center gap-6">
        {/* Barra de Pesquisa Rápida */}
        <div className="hidden lg:flex items-center relative">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2 bg-[#1A1A2E] border border-white/5 rounded-full text-sm text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#6C63FF] transition-colors"
          />
        </div>

        <button className="relative p-2 text-[#A1A1AA] hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#6C63FF] rounded-full border-2 border-[#0B0B0F]"></span>
        </button>

        {/* Avatar e Nome do Usuário */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-tight">{user?.name || 'Carregando...'}</p>
            <p className="text-xs text-[#A1A1AA]">Conta Premium</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#c4b5fd] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#1A1A2E] border-2 border-[#0B0B0F] flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}