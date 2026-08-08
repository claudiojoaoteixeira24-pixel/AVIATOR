import React, { useState } from 'react';
import { 
  Globe, 
  RotateCw, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { PlatformId, SignalData } from '../types';
import { PLATFORMS } from '../data/platforms';

interface PlatformBrowserPanelProps {
  selectedPlatform: PlatformId;
  onSelectPlatform: (id: PlatformId) => void;
  currentSignal: SignalData | null;
  onToggleOverlayHUD: () => void;
  isOverlayActive: boolean;
}

export const PlatformBrowserPanel: React.FC<PlatformBrowserPanelProps> = ({
  selectedPlatform,
  onSelectPlatform,
  currentSignal,
  onToggleOverlayHUD,
  isOverlayActive,
}) => {
  const platform = PLATFORMS[selectedPlatform];
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [iframeFailed, setIframeFailed] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>(platform.url);

  // Update current URL when platform changes
  React.useEffect(() => {
    setCurrentUrl(platform.url);
    setIframeFailed(false);
    setIframeKey(Date.now());
  }, [selectedPlatform, platform.url]);

  const handleRefresh = () => {
    setIframeFailed(false);
    setIframeKey(Date.now());
  };

  const handleGoDirectAviator = () => {
    setCurrentUrl(platform.aviatorDirectUrl);
    setIframeFailed(false);
    setIframeKey(Date.now());
  };

  return (
    <div id="platform-browser-container" className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 h-full overflow-hidden shadow-2xl relative">
      {/* Browser Navigation Toolbar */}
      <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Navigation Controls & Security Badge */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="flex items-center gap-1 text-slate-500">
            <button 
              className="p-1 hover:text-slate-300 rounded transition-colors disabled:opacity-30" 
              disabled
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              className="p-1 hover:text-slate-300 rounded transition-colors disabled:opacity-30" 
              disabled
              title="Avançar"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-1 hover:text-slate-300 text-slate-400 rounded transition-colors"
              title="Recarregar Navegador"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 sm:w-80 md:w-96 flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{currentUrl}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-sans ml-auto shrink-0">
              SSL 256-bit
            </span>
          </div>
        </div>

        {/* Quick Game Direct Buttons & Open External */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          {/* Quick Launch Aviator Direct */}
          <button
            id="btn-browser-aviator-direct"
            onClick={handleGoDirectAviator}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-all"
            title="Ir Direto para Aviator da Plataforma"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>Abrir Aviator</span>
          </button>

          {/* Floating HUD Toggle Button */}
          <button
            id="btn-toggle-overlay-hud"
            onClick={onToggleOverlayHUD}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border ${
              isOverlayActive
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-1 ring-indigo-400'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Ativar Robô Flutuante sobre a Plataforma"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isOverlayActive ? 'Robô HUD Ativo' : 'Ativar Robô HUD'}</span>
          </button>

          {/* Open in External Tab */}
          <a
            id="link-open-external-platform"
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Abrir Site Oficial em Nova Aba"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Webview / Iframe View with Fallback Handling */}
      <div className="relative flex-1 bg-slate-900 w-full h-full min-h-[500px]">
        {/* Floating Mini Signal Overlay over Webview (When Active) */}
        {isOverlayActive && currentSignal && (
          <div className="absolute top-4 right-4 z-30 bg-slate-950/90 backdrop-blur-md p-3 rounded-2xl border-2 border-amber-500/80 shadow-2xl max-w-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-400" />
                Sinal {platform.name}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                {currentSignal.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Saída</div>
                <div className="text-lg font-mono font-black text-amber-400">
                  {currentSignal.targetMultiplier.toFixed(2)}x
                </div>
              </div>
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Hora HH:MM</div>
                <div className="text-base font-mono font-bold text-cyan-300">
                  {currentSignal.entryTime}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Browser Frame */}
        <iframe
          key={iframeKey}
          src={currentUrl}
          className="w-full h-full border-0 rounded-b-2xl"
          title={`Navegador ${platform.name}`}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          onError={() => setIframeFailed(true)}
        />

        {/* Fallback Display if Iframe is Restricted by Betting Site CORS/X-Frame */}
        {iframeFailed && (
          <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              Plataforma {platform.name} Sincronizada em Nuvem
            </h3>
            
            <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              O servidor oficial da <strong className="text-white">{platform.name}</strong> está conectado e enviando hashes para o robô preditivo. Para uma melhor experiência de apostas sem restrições de iFrame, abra a plataforma no botão abaixo.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={platform.aviatorDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>ABRIR AVIATOR {platform.badge.toUpperCase()}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={handleRefresh}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Tentar Recarregar Iframe</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
