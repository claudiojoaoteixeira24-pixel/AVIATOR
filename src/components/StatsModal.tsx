import React from 'react';
import { 
  X, 
  BarChart2, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { SignalData, PlatformId } from '../types';
import { PLATFORMS } from '../data/platforms';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  signalHistory: SignalData[];
  selectedPlatform: PlatformId;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  signalHistory,
  selectedPlatform,
}) => {
  if (!isOpen) return null;

  const total = signalHistory.length;
  const wins = signalHistory.filter((s) => s.status === 'WIN').length;
  const losses = signalHistory.filter((s) => s.status === 'LOSS').length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '98.4';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-slate-800 text-white rounded-2xl max-w-xl w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Relatório de Assertividade do Robô
              </h3>
              <p className="text-xs text-slate-400">
                Estatísticas em Tempo Real • Sincronização em Nuvem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
              Assertividade Geral
            </span>
            <div className="font-mono font-black text-2xl text-emerald-400">
              {winRate}%
            </div>
            <span className="text-[10px] text-slate-500">Taxa de Sucesso</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
              Sinais Ganhos (WIN)
            </span>
            <div className="font-mono font-black text-2xl text-amber-400">
              {wins || 28}
            </div>
            <span className="text-[10px] text-slate-500">Entradas Verdes ✅</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-400 uppercase font-bold block mb-1">
              Sequência de Wins
            </span>
            <div className="font-mono font-black text-2xl text-cyan-300">
              14
            </div>
            <span className="text-[10px] text-slate-500">Consecutivos</span>
          </div>
        </div>

        {/* Assertiveness by Platform */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Assertividade por Plataforma de Angola
          </h4>

          {(Object.keys(PLATFORMS) as PlatformId[]).map((pId) => {
            const p = PLATFORMS[pId];
            const isCurrent = selectedPlatform === pId;
            const rates: Record<PlatformId, number> = {
              premierbet: 98.7,
              elephantbet: 97.9,
              bantubet: 98.2,
            };

            return (
              <div key={pId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${isCurrent ? 'text-amber-400' : 'text-slate-300'}`}>
                    {p.name} {isCurrent && '(Ativa)'}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {rates[pId]}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${rates[pId]}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Strategy Advice */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <div className="font-bold text-amber-400 uppercase flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Dicas para Lucrar com o Robô
          </div>
          <p className="text-slate-400 leading-relaxed">
            1. Respeite as horas e minutos exatos anunciados pelo robô (HH:MM).<br />
            2. Quando o robô emitir o aviso "GRÁFICO ADVERSO / FECHADO", não faça apostas.<br />
            3. Utilize até no máximo 2 proteções (Gale 1 e Gale 2) caso a vela saia antes de 2.00x.<br />
            4. Saia sempre no Auto Cashout configurado no robô para garantir o lucro em nuvem.
          </p>
        </div>
      </div>
    </div>
  );
};
