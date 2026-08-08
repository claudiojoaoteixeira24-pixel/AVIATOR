import React, { useState } from 'react';
import { 
  Zap, 
  Clock, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  Lock, 
  Unlock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { SignalData, PlatformId } from '../types';
import { PLATFORMS } from '../data/platforms';

interface FloatingBotOverlayProps {
  selectedPlatform: PlatformId;
  currentSignal: SignalData | null;
  onGenerateNewSignal: () => void;
  onCloseOverlay: () => void;
  isAiAnalyzing: boolean;
}

export const FloatingBotOverlay: React.FC<FloatingBotOverlayProps> = ({
  selectedPlatform,
  currentSignal,
  onGenerateNewSignal,
  onCloseOverlay,
  isAiAnalyzing,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const platform = PLATFORMS[selectedPlatform];

  if (isMinimized) {
    return (
      <div 
        id="floating-overlay-minimized"
        className="fixed bottom-6 right-6 z-50 bg-slate-950/90 border-2 border-amber-500 text-white p-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
        onClick={() => setIsMinimized(false)}
      >
        <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>
        <div className="pr-2 font-mono text-xs font-bold text-amber-300">
          {currentSignal ? `${currentSignal.targetMultiplier.toFixed(2)}x` : 'ROBÔ VIVO'}
        </div>
        <Maximize2 className="w-4 h-4 text-slate-400" />
      </div>
    );
  }

  return (
    <div 
      id="floating-overlay-expanded"
      className="fixed bottom-6 right-6 z-50 bg-slate-950/95 border-2 border-amber-500/80 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-xl w-80 sm:w-96 animate-in fade-in zoom-in-95"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <span>Robô Preditivo HUD</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1 py-0.2 rounded">
                VIVO
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {platform.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Minimizar Robô"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onCloseOverlay}
            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
            title="Fechar Robô Flutuante"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Market status & Signal main detail */}
      {currentSignal?.marketStatus === 'FECHADO' ? (
        <div className="bg-rose-950/80 border border-rose-600/60 rounded-xl p-3 text-center mb-3">
          <div className="flex items-center justify-center gap-1.5 text-rose-400 font-bold text-xs uppercase mb-1">
            <Lock className="w-4 h-4 text-rose-500" />
            <span>Gráfico Adverso / Pausa</span>
          </div>
          <p className="text-[11px] text-rose-200">
            Aguardando melhor momento. Abertura prevista para <strong className="font-mono">{currentSignal.entryTime}</strong>.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-emerald-500/50 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              Gráfico Aberto
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-300">
              Assertividade: {currentSignal?.confidence || 98.4}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Saída Auto
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {currentSignal?.targetMultiplier.toFixed(2) || '2.20'}x
              </span>
            </div>

            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Hora da Entrada
              </span>
              <span className="text-base font-bold text-cyan-300 font-mono">
                {currentSignal?.entryTime || '14:35:00'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Button */}
      <button
        onClick={onGenerateNewSignal}
        disabled={isAiAnalyzing}
        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isAiAnalyzing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Sincronizando Nuvem...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>NOVO SINAL EM NUVEM</span>
          </>
        )}
      </button>
    </div>
  );
};
