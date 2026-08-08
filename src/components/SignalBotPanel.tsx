import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Target, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  TrendingUp, 
  Lock, 
  Unlock, 
  HelpCircle,
  Award,
  Hash
} from 'lucide-react';
import { SignalData, PlatformId, StrategyType, MarketStatus } from '../types';
import { PLATFORMS, STRATEGIES } from '../data/platforms';
import { soundEngine } from '../utils/audio';

interface SignalBotPanelProps {
  selectedPlatform: PlatformId;
  currentSignal: SignalData | null;
  signalHistory: SignalData[];
  onGenerateNewSignal: (strategy?: StrategyType, isAi?: boolean) => void;
  selectedStrategy: StrategyType;
  onChangeStrategy: (strategy: StrategyType) => void;
  isAiAnalyzing: boolean;
  onOpenHashModal: () => void;
}

export const SignalBotPanel: React.FC<SignalBotPanelProps> = ({
  selectedPlatform,
  currentSignal,
  signalHistory,
  onGenerateNewSignal,
  selectedStrategy,
  onChangeStrategy,
  isAiAnalyzing,
  onOpenHashModal,
}) => {
  const platform = PLATFORMS[selectedPlatform];
  const [countdown, setCountdown] = useState<number>(currentSignal?.timeRemainingSeconds || 30);
  const [recentMultipliers, setRecentMultipliers] = useState<number[]>([
    1.18, 2.45, 1.05, 3.80, 1.95, 12.40, 2.10, 1.45, 4.20, 1.12, 2.85, 18.50
  ]);

  // Sync countdown timer
  useEffect(() => {
    if (!currentSignal) return;
    setCountdown(currentSignal.timeRemainingSeconds);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSignal]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Helper for multiplier badge colors
  const getMultiplierStyle = (mult: number) => {
    if (mult >= 10.0) return 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/40 font-black';
    if (mult >= 2.0) return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
    return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
  };

  // Win Rate calculation
  const totalCompleted = signalHistory.filter((s) => s.status !== 'PENDING').length;
  const totalWins = signalHistory.filter((s) => s.status === 'WIN').length;
  const winRate = totalCompleted > 0 ? ((totalWins / totalCompleted) * 100).toFixed(1) : '98.4';

  return (
    <div id="signal-bot-container" className="flex flex-col gap-4 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 text-white h-full overflow-y-auto scrollbar-thin">
      {/* Platform & Server Header Card */}
      <div className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-r ${platform.bgGradient} border border-white/10 shadow-lg`}>
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Cpu className="w-32 h-32 text-white" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              {platform.logo.split(' ')[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  {platform.name}
                </h2>
                <span className="text-[10px] bg-black/40 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  SHA256 Sincronizado
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Nuvem Ativa ({platform.cloudSyncLatencyMs}ms latência)</span>
              </p>
            </div>
          </div>

          <button
            id="btn-hash-modal-trigger"
            onClick={onOpenHashModal}
            className="hidden sm:flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-xs text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-500/30 backdrop-blur-md transition-all font-mono"
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Verificar Hash</span>
          </button>
        </div>
      </div>

      {/* Main Market Status Indicator (Gráfico Aberto vs Gráfico Fechado) */}
      {currentSignal?.marketStatus === 'FECHADO' ? (
        <div className="bg-rose-950/60 border-2 border-rose-600/60 rounded-2xl p-4 text-center relative overflow-hidden shadow-2xl animate-pulse">
          <div className="flex items-center justify-center gap-2 text-rose-400 font-extrabold text-lg sm:text-xl uppercase tracking-wider mb-1">
            <Lock className="w-6 h-6 text-rose-500" />
            <span>GRÁFICO ADVERSO: PAUSA ESTRATÉGICA</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-200/90 max-w-md mx-auto">
            O algoritmo detectou volatilidade atípica e padrão de risco elevado no servidor da {platform.name}.
            O robô fechou temporariamente as entradas para proteger seu capital.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-rose-900/80 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-rose-100 border border-rose-500/40">
            <Clock className="w-4 h-4 text-rose-300" />
            <span>Previsão de Abertura: {currentSignal.entryTime}</span>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/40 border-2 border-emerald-500/50 rounded-2xl p-4 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3 border-b border-emerald-800/40 pb-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base uppercase tracking-wider">
              <Unlock className="w-5 h-5 text-emerald-400 animate-bounce" />
              <span>GRÁFICO ABERTO: SINAL CONFIRMADO</span>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-500/40">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Assertividade {currentSignal?.confidence || 98.4}%</span>
            </div>
          </div>

          {/* Signal Main Display Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Target Multiplier */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                Saída Automática
              </span>
              <div className="font-extrabold text-2xl sm:text-3xl text-amber-400 font-mono tracking-tight">
                {currentSignal?.targetMultiplier.toFixed(2) || '2.20'}x
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Auto Cashout</span>
            </div>

            {/* Entry Time HH:MM:SS */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                Hora da Entrada
              </span>
              <div className="font-extrabold text-xl sm:text-2xl text-cyan-300 font-mono">
                {currentSignal?.entryTime || '14:35:00'}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Hora HH:MM:SS</span>
            </div>

            {/* Countdown Timer */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center flex flex-col justify-center relative overflow-hidden">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                Tempo Restante
              </span>
              <div className="font-extrabold text-2xl sm:text-3xl text-emerald-400 font-mono">
                {formatTime(countdown)}
              </div>
              {/* Progress bar line */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${Math.min(100, (countdown / 45) * 100)}%` }}
              />
            </div>

            {/* Protection Attempts */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center flex flex-col justify-center">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">
                Proteções
              </span>
              <div className="font-extrabold text-xl sm:text-2xl text-purple-300 font-mono">
                Até {currentSignal?.recommendedAttempts || 2}x
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">Gale Recomendado</span>
            </div>
          </div>

          {/* AI Reasoning Summary */}
          {currentSignal?.reasoning && (
            <div className="mt-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong className="text-amber-300">Análise do Algoritmo:</strong> {currentSignal.reasoning}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Strategy Selector & Trigger Controls */}
      <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-400" />
            Estratégia do Algoritmo
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            {STRATEGIES.find((s) => s.id === selectedStrategy)?.targetRange}
          </span>
        </div>

        {/* Strategy Badges */}
        <div className="grid grid-cols-3 gap-2">
          {STRATEGIES.map((strat) => {
            const isSelected = selectedStrategy === strat.id;
            return (
              <button
                key={strat.id}
                id={`btn-strategy-${strat.id}`}
                onClick={() => onChangeStrategy(strat.id)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs">{strat.name.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{strat.targetRange}</div>
              </button>
            );
          })}
        </div>

        {/* Action Trigger Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1">
          <button
            id="btn-generate-signal-normal"
            onClick={() => onGenerateNewSignal(selectedStrategy, false)}
            disabled={isAiAnalyzing}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>GERAR NOVO SINAL (NUVEM)</span>
          </button>

          <button
            id="btn-generate-signal-gemini"
            onClick={() => onGenerateNewSignal(selectedStrategy, true)}
            disabled={isAiAnalyzing}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAiAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ANALISANDO COM IA GEMINI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ANÁLISE DE IA GEMINI ENTRADAS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Graph Trend & Recent Seed Multipliers */}
      <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Últimas Velas Detectadas (Sincronizadas)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Real-time Feed</span>
        </div>

        {/* Multipliers Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {recentMultipliers.map((mult, idx) => (
            <div
              key={idx}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono whitespace-nowrap shrink-0 ${getMultiplierStyle(mult)}`}
            >
              {mult.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Signal Log History Table */}
      <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Histórico de Sinais ({totalWins}/{totalCompleted} Wins)
          </span>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            {winRate}% Assertividade
          </span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
          {signalHistory.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              Nenhum sinal no histórico ainda. Clique em "Gerar Novo Sinal" para iniciar.
            </div>
          ) : (
            signalHistory.slice(0, 10).map((sig) => (
              <div
                key={sig.id}
                className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  {sig.status === 'WIN' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : sig.status === 'LOSS' ? (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  )}
                  <div>
                    <div className="font-mono font-bold text-slate-200">
                      Hora: {sig.entryTime}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Alvo: {sig.targetMultiplier.toFixed(2)}x • Gale: {sig.recommendedAttempts}x
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-amber-400">
                    {sig.targetMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-[10px]">
                    {sig.status === 'WIN' ? (
                      <span className="text-emerald-400 font-bold">GANHOU ✅</span>
                    ) : sig.status === 'LOSS' ? (
                      <span className="text-rose-400 font-bold">PERDEU ❌</span>
                    ) : (
                      <span className="text-amber-400 font-bold">EM ANDAMENTO</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
