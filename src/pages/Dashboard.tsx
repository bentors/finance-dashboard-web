import { useState, useEffect } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { SummaryCard } from '../components/ui/SummaryCard'
import { TransactionTable } from '../components/ui/TransactionTable'
import { formatCurrency } from '../utils/formatCurrency'
import { getSummary, findAllTransactions } from '../services/transaction.service'
import type { DashboardSummary, TransactionResponse } from '../services/transaction.service'
import { Wallet, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]) // Estado para a lista
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        
        const firstDay = `${year}-${month}-01`;
        const lastDayObj = new Date(year, today.getMonth() + 1, 0);
        const lastDay = `${year}-${month}-${String(lastDayObj.getDate()).padStart(2, '0')}`;

        // Buscando dados em paralelo (mais rápido!)
        const [summaryData, transData] = await Promise.all([
          getSummary(firstDay, lastDay),
          findAllTransactions(0, 5)
        ]);

        setSummary(summaryData);
        setTransactions(transData.content);
        
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-[#0B0B0F] font-sans text-[#F5F5F5]">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex-1 overflow-y-auto p-8 sm:p-12">
          
          {isLoading ? (
            <div className="w-full flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Grid de Cards Superiores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard 
                  title="Saldo Atual" 
                  value={formatCurrency(summary?.balance || 0)} 
                  icon={<Wallet className="w-5 h-5" />} 
                  variant="default"
                />
                <SummaryCard 
                  title="Receitas no Mês" 
                  value={formatCurrency(summary?.totalIncome || 0)} 
                  icon={<TrendingUp className="w-5 h-5" />} 
                  trend="Entradas totais"
                  variant="success"
                />
                <SummaryCard 
                  title="Despesas no Mês" 
                  value={formatCurrency(summary?.totalExpense || 0)} 
                  icon={<TrendingDown className="w-5 h-5" />} 
                  trend="Saídas totais"
                  variant="danger"
                />
              </div>

              {/* Tabela de Transações Recentes */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <TransactionTable transactions={transactions} />
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}