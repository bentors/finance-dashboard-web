import { formatCurrency } from '../../utils/formatCurrency';
import  type { TransactionResponse } from '../../services/transaction.service';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransactionTableProps {
  transactions: TransactionResponse[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-heading text-lg font-bold text-white">Últimas Transações</h3>
        <button className="text-sm text-[#6C63FF] hover:underline">Ver todas</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] text-[#A1A1AA] text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Descrição</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Se o valor for positivo, ícone verde, senão vermelho */}
                    {t.amount > 0 ? (
                      <ArrowUpCircle className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                    <span className="text-white font-medium">{t.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#A1A1AA] text-sm">
                  <span className="bg-white/5 px-3 py-1 rounded-full">{t.category.name}</span>
                </td>
                <td className="px-6 py-4 text-[#A1A1AA] text-sm">
                  {new Date(t.transactionDate).toLocaleDateString('pt-BR')}
                </td>
                <td className={`px-6 py-4 text-right font-bold ${t.amount > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="p-10 text-center text-[#A1A1AA]">
            Nenhuma transação encontrada para este período.
          </div>
        )}
      </div>
    </div>
  );
}