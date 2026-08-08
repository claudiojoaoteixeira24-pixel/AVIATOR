import React from 'react';
import { 
  Zap, 
  Wifi, 
  Volume2, 
  VolumeX, 
  LayoutGrid, 
  Layers, 
  Bot, 
  Globe, 
  Sparkles,
  BarChart2,
  Code2,
  LogIn,
  LogOut
} from 'lucide-react';
import { PlatformId, LayoutMode } from '../types';
import { PLATFORMS } from '../data/platforms';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  selectedPlatform: PlatformId;
  onSelectPlatform: (platform: PlatformId) => void;
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onOpenHashModal: () => void;
  onOpenSketchwareModal: () => void;
  isAiAnalyzing: boolean;
  cloudSyncLatency: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPlatform,
  onSelectPlatform,
  layoutMode,
  onChangeLayoutMode,
  soundEnabled,
  onToggleSound,
  onOpenStats,
  onOpenHashModal,
  onOpenSketchwareModal,
  isAiAnalyzing,
  cloudSyncLatency,
}) => {
  const currentPlatform = PLATFORMS[selectedPlatform];
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header id="app-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40 px-3 py-2 sm:px-4 sm:py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-300 bg-clip-text text-transparent">
                  AVIATOR SIGNALS AO
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  VIVO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Robô Preditivo em Nuvem</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-mono font-medium">Spribe AI Engine</span>
              </p>
            </div>
          </div>

          {/* Quick Mobile Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              id="btn-sketchware-mobile"
              onClick={onOpenSketchwareModal}
              className="px-2 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1"
              title="Códigos Sketchware (Sem Erro)"
            >
              <Code2 className="w-4 h-4" />
              <span>SKETCHWARE</span>
            </button>
            <button
              id="btn-sound-toggle-mobile"
              onClick={onToggleSound}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled 
                  ? 'bg-slate-800 border-slate-700 text-amber-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Som Ativado' : 'Som Desativado'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              id="btn-stats-mobile"
              onClick={onOpenStats}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400 hover:text-indigo-300"
              title="Estatísticas de Assertividade"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Platform Selector (PremierBet AO, ElephantBet AO, BantuBet AO) */}
        <div className="flex items-center justify-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 w-full md:w-auto overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider hidden lg:inline">
            Plataforma:
          </span>
          <div className="flex items-center gap-1 w-full md:w-auto">
            {(Object.keys(PLATFORMS) as PlatformId[]).map((pId) => {
              const p = PLATFORMS[pId];
              const isSelected = selectedPlatform === pId;
              return (
                <button
                  key={pId}
                  id={`btn-platform-${pId}`}
                  onClick={() => onSelectPlatform(pId)}
                  className={`flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? `bg-slate-800 text-white border border-slate-600 shadow-md ring-1 ring-amber-500/50`
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-sm">{p.logo.split(' ')[0]}</span>
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls, Layout Switcher & Status Indicators */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2">
          {/* Cloud Latency Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono">
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Nuvem {cloudSyncLatency}ms</span>
          </div>

          {/* Layout Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              id="btn-layout-split"
              onClick={() => onChangeLayoutMode('split')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                layoutMode === 'split'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tela Dupla (Robô + Navegador Lado a Lado)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Dupla</span>
            </button>

            <button
              id="btn-layout-overlay"
              onClick={() => onChangeLayoutMode('overlay')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                layoutMode === 'overlay'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Robô Flutuante sobre o Navegador (Overlay)"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Flutuante</span>
            </button>

            <button
              id="btn-layout-bot"
              onClick={() => onChangeLayoutMode('bot_only')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                layoutMode === 'bot_only'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Apenas Robô de Sinais"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Robô</span>
            </button>

            <button
              id="btn-layout-browser"
              onClick={() => onChangeLayoutMode('browser_only')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                layoutMode === 'browser_only'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Apenas Navegador da Plataforma"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">Plataforma</span>
            </button>
          </div>

          {/* Authentication Button */}
          <div className="flex items-center">
            {user ? (
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline">Sair</span>
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Entrar com Google"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden xl:inline">Entrar</span>
              </button>
            )}
          </div>

          {/* Sound & Stats Action Buttons */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              id="btn-sketchware-desktop"
              onClick={onOpenSketchwareModal}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Códigos Sketchware Pro / Original (Sem Erro)"
            >
              <Code2 className="w-4 h-4" />
              <span>SKETCHWARE 😎</span>
            </button>

            <button
              id="btn-sound-toggle-desktop"
              onClick={onToggleSound}
              className={`p-2 rounded-lg border transition-colors ${
                soundEnabled 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Som dos Sinais Ativado' : 'Som Desativado'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="btn-hash-inspector"
              onClick={onOpenHashModal}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
              title="Analisador de Hash SHA256"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              id="btn-stats-desktop"
              onClick={onOpenStats}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 transition-colors"
              title="Relatório de Assertividade e Lucros"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
