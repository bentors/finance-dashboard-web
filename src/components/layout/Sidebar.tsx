import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext' // Ajuste o caminho se necessário
import { BarChart3, LayoutDashboard, ArrowRightLeft, Wallet, Settings, LogOut } from 'lucide-react'

export function Sidebar() {
  const { signOut } = useContext(AuthContext)

  return (
    <aside className="w-72 bg-[#1A1A2E] border-r border-white/5 flex flex-col hidden md:flex shrink-0">
      {/* Logo */}
      <div className="h-24 flex items-center gap-3 px-8 border-b border-white/5">
        <div className="p-2 bg-[#6C63FF]/10 rounded-lg border border-[#6C63FF]/20">
          <BarChart3 className="w-6 h-6 text-[#6C63FF]" />
        </div>
        <span className="font-heading text-xl font-bold tracking-tight text-white">Aurum</span>
      </div>

      {/* Links de Navegação */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#6C63FF]/10 text-[#6C63FF] rounded-xl font-medium border border-[#6C63FF]/20 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Visão Geral
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#A1A1AA] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
          <ArrowRightLeft className="w-5 h-5" />
          Transações
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#A1A1AA] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
          <Wallet className="w-5 h-5" />
          Cartões
        </a>
      </nav>

      {/* Rodapé do Menu */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#A1A1AA] hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors">
          <Settings className="w-5 h-5" />
          Configurações
        </a>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-[#EF4444]/80 hover:bg-[#EF4444]/10 hover:text-[#EF4444] rounded-xl font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}