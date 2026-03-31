import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: string; // Ex: "+5%"
  variant?: 'default' | 'success' | 'danger';
}

export function SummaryCard({ title, value, icon, trend, variant = 'default' }: SummaryCardProps) {
  
  // Define as cores baseadas na variante
  const colors = {
    default: { text: 'text-[#6C63FF]', bg: 'bg-[#6C63FF]/10', trendText: 'text-[#6C63FF]' },
    success: { text: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10', trendText: 'text-[#22C55E]' },
    danger:  { text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', trendText: 'text-[#EF4444]' },
  };

  const currentColors = colors[variant];

  return (
    <div className="bg-[#1A1A2E] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
      
      {/* Efeito de Glow sutil no hover */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity ${currentColors.bg}`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-[#A1A1AA] text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-xl ${currentColors.bg} ${currentColors.text}`}>
          {icon}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">
          {value}
        </div>
        {trend && (
          <div className={`${currentColors.trendText} text-sm font-semibold`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}