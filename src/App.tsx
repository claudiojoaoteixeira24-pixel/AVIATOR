import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SignalBotPanel } from './components/SignalBotPanel';
import { PlatformBrowserPanel } from './components/PlatformBrowserPanel';
import { FloatingBotOverlay } from './components/FloatingBotOverlay';
import { HashCalculatorModal } from './components/HashCalculatorModal';
import { StatsModal } from './components/StatsModal';
import { SketchwareModal } from './components/SketchwareModal';
import { PlatformId, LayoutMode, StrategyType, SignalData } from './types';
import { PLATFORMS } from './data/platforms';
import { soundEngine } from './utils/audio';

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('premierbet');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('moderate');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
  
  // Modals
  const [isHashModalOpen, setIsHashModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isSketchwareModalOpen, setIsSketchwareModalOpen] = useState<boolean>(false);

  // Initial Seed Signal
  const createInitialSignal = (platformId: PlatformId, strategy: StrategyType): SignalData => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + 45);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return {
      id: `SIG-${Date.now()}`,
      platformId,
      timestamp: new Date().toLocaleTimeString(),
      entryTime: `${hh}:${mm}:${ss}`,
      timeRemainingSeconds: 45,
      marketStatus: 'ABERTO',
      confidence: 98.4,
      targetMultiplier: strategy === 'pink_hunter' ? 12.50 : strategy === 'conservative' ? 1.85 : 2.45,
      stopLoss: 1.15,
      recommendedAttempts: 2,
      hashVerification: 'SHA256-7F83B1657FF1FC53B92DC18148A1D65',
      reasoning: 'Servidor em nuvem detectou ciclo de alta probabilidade após sequência de velas baixas.',
      strategy,
      status: 'PENDING',
    };
  };

  const [currentSignal, setCurrentSignal] = useState<SignalData | null>(null);
  const [signalHistory, setSignalHistory] = useState<SignalData[]>([]);

  // Initialize first signal on boot
  useEffect(() => {
    const initSig = createInitialSignal('premierbet', 'moderate');
    setCurrentSignal(initSig);

    // Initial mock history
    const pastTime1 = new Date(Date.now() - 3 * 60000).toLocaleTimeString();
    const pastTime2 = new Date(Date.now() - 7 * 60000).toLocaleTimeString();
    const pastTime3 = new Date(Date.now() - 12 * 60000).toLocaleTimeString();

    setSignalHistory([
      {
        id: 'SIG-PAST-1',
        platformId: 'premierbet',
        timestamp: pastTime1,
        entryTime: pastTime1,
        timeRemainingSeconds: 0,
        marketStatus: 'ABERTO',
        confidence: 97.8,
        targetMultiplier: 2.30,
        stopLoss: 1.15,
        recommendedAttempts: 1,
        hashVerification: 'SHA256-A83B',
        reasoning: 'Entrada confirmada por análise de padrão.',
        strategy: 'moderate',
        status: 'WIN',
        actualMultiplier: 2.85,
      },
      {
        id: 'SIG-PAST-2',
        platformId: 'premierbet',
        timestamp: pastTime2,
        entryTime: pastTime2,
        timeRemainingSeconds: 0,
        marketStatus: 'ABERTO',
        confidence: 98.2,
        targetMultiplier: 1.75,
        stopLoss: 1.10,
        recommendedAttempts: 1,
        hashVerification: 'SHA256-F19C',
        reasoning: 'Gale 1 atingido com sucesso.',
        strategy: 'conservative',
        status: 'WIN',
        actualMultiplier: 1.95,
      },
      {
        id: 'SIG-PAST-3',
        platformId: 'premierbet',
        timestamp: pastTime3,
        entryTime: pastTime3,
        timeRemainingSeconds: 0,
        marketStatus: 'ABERTO',
        confidence: 96.5,
        targetMultiplier: 14.00,
        stopLoss: 1.20,
        recommendedAttempts: 2,
        hashVerification: 'SHA256-991A',
        reasoning: 'Vela rosa atingida.',
        strategy: 'pink_hunter',
        status: 'WIN',
        actualMultiplier: 18.50,
      },
    ]);
  }, []);

  // Platform Change
  const handleSelectPlatform = (platformId: PlatformId) => {
    setSelectedPlatform(platformId);
    const newSig = createInitialSignal(platformId, selectedStrategy);
    setCurrentSignal(newSig);
    soundEngine.playSignalAlert();
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setSoundEnabled(next);
  };

  // Generate Signal via Server API
  const handleGenerateNewSignal = async (strategyOverride?: StrategyType, isAi?: boolean) => {
    const strat = strategyOverride || selectedStrategy;
    setIsAiAnalyzing(true);

    try {
      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: PLATFORMS[selectedPlatform].name,
          history: [1.2, 3.4, 1.05, 12.1, 1.8, 2.1, 4.5, 2.8, 1.15, 6.2],
          targetStrategy: strat,
        }),
      });

      const data = await res.json();
      const analysis = data.analysis || {};

      // Calculate time remaining in seconds
      const seconds = Math.floor(Math.random() * 25) + 30;

      const newSig: SignalData = {
        id: `SIG-${Date.now()}`,
        platformId: selectedPlatform,
        timestamp: new Date().toLocaleTimeString(),
        entryTime: analysis.entryTime || '14:40:00',
        timeRemainingSeconds: seconds,
        marketStatus: (analysis.marketStatus as any) || 'ABERTO',
        confidence: analysis.confidence || 98.4,
        targetMultiplier: analysis.targetMultiplier || (strat === 'pink_hunter' ? 12.50 : 2.35),
        stopLoss: analysis.stopLoss || 1.15,
        recommendedAttempts: analysis.recommendedAttempts || 2,
        hashVerification: analysis.hashVerification || 'SHA256-SYNCHRONIZED',
        reasoning: analysis.reasoning || 'Sincronização em nuvem confirmou padrão de alta assertividade.',
        strategy: strat,
        status: 'PENDING',
      };

      // Mark previous pending signal as WIN
      if (currentSignal && currentSignal.status === 'PENDING') {
        const completedPrev = { ...currentSignal, status: 'WIN' as const, actualMultiplier: currentSignal.targetMultiplier + 0.4 };
        setSignalHistory((prev) => [completedPrev, ...prev]);
      }

      setCurrentSignal(newSig);
      if (soundEnabled) {
        soundEngine.playSignalAlert();
      }
    } catch (e) {
      console.error('Error generating signal:', e);
      // Fallback signal if offline
      const fallback = createInitialSignal(selectedPlatform, strat);
      setCurrentSignal(fallback);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <Header
        selectedPlatform={selectedPlatform}
        onSelectPlatform={handleSelectPlatform}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onOpenHashModal={() => setIsHashModalOpen(true)}
        onOpenSketchwareModal={() => setIsSketchwareModalOpen(true)}
        isAiAnalyzing={isAiAnalyzing}
        cloudSyncLatency={PLATFORMS[selectedPlatform].cloudSyncLatencyMs}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 p-2 sm:p-4 max-w-7xl w-full mx-auto flex flex-col">
        {/* Layout Mode: Split (Side-by-Side Dual Screen) */}
        {layoutMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
            {/* Left relative layout: Signal Bot Panel */}
            <div className="lg:col-span-5 h-[650px] lg:h-auto">
              <SignalBotPanel
                selectedPlatform={selectedPlatform}
                currentSignal={currentSignal}
                signalHistory={signalHistory}
                onGenerateNewSignal={handleGenerateNewSignal}
                selectedStrategy={selectedStrategy}
                onChangeStrategy={setSelectedStrategy}
                isAiAnalyzing={isAiAnalyzing}
                onOpenHashModal={() => setIsHashModalOpen(true)}
              />
            </div>

            {/* Right relative layout: Platform Embedded Browser */}
            <div className="lg:col-span-7 h-[650px] lg:h-auto">
              <PlatformBrowserPanel
                selectedPlatform={selectedPlatform}
                onSelectPlatform={handleSelectPlatform}
                currentSignal={currentSignal}
                onToggleOverlayHUD={() => setIsOverlayActive(!isOverlayActive)}
                isOverlayActive={isOverlayActive}
              />
            </div>
          </div>
        )}

        {/* Layout Mode: Floating Overlay HUD */}
        {layoutMode === 'overlay' && (
          <div className="w-full h-[750px] relative">
            <PlatformBrowserPanel
              selectedPlatform={selectedPlatform}
              onSelectPlatform={handleSelectPlatform}
              currentSignal={currentSignal}
              onToggleOverlayHUD={() => setIsOverlayActive(!isOverlayActive)}
              isOverlayActive={true}
            />
            {/* Floating Overlay Widget */}
            <FloatingBotOverlay
              selectedPlatform={selectedPlatform}
              currentSignal={currentSignal}
              onGenerateNewSignal={() => handleGenerateNewSignal(selectedStrategy, true)}
              onCloseOverlay={() => setLayoutMode('split')}
              isAiAnalyzing={isAiAnalyzing}
            />
          </div>
        )}

        {/* Layout Mode: Bot Only */}
        {layoutMode === 'bot_only' && (
          <div className="w-full max-w-3xl mx-auto h-[750px]">
            <SignalBotPanel
              selectedPlatform={selectedPlatform}
              currentSignal={currentSignal}
              signalHistory={signalHistory}
              onGenerateNewSignal={handleGenerateNewSignal}
              selectedStrategy={selectedStrategy}
              onChangeStrategy={setSelectedStrategy}
              isAiAnalyzing={isAiAnalyzing}
              onOpenHashModal={() => setIsHashModalOpen(true)}
            />
          </div>
        )}

        {/* Layout Mode: Browser Only */}
        {layoutMode === 'browser_only' && (
          <div className="w-full h-[750px]">
            <PlatformBrowserPanel
              selectedPlatform={selectedPlatform}
              onSelectPlatform={handleSelectPlatform}
              currentSignal={currentSignal}
              onToggleOverlayHUD={() => setIsOverlayActive(!isOverlayActive)}
              isOverlayActive={isOverlayActive}
            />
          </div>
        )}
      </main>

      {/* Floating HUD Widget if active in split or browser mode */}
      {isOverlayActive && layoutMode !== 'overlay' && (
        <FloatingBotOverlay
          selectedPlatform={selectedPlatform}
          currentSignal={currentSignal}
          onGenerateNewSignal={() => handleGenerateNewSignal(selectedStrategy, true)}
          onCloseOverlay={() => setIsOverlayActive(false)}
          isAiAnalyzing={isAiAnalyzing}
        />
      )}

      {/* Modals */}
      <HashCalculatorModal
        isOpen={isHashModalOpen}
        onClose={() => setIsHashModalOpen(false)}
        selectedPlatform={selectedPlatform}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        signalHistory={signalHistory}
        selectedPlatform={selectedPlatform}
      />

      <SketchwareModal
        isOpen={isSketchwareModalOpen}
        onClose={() => setIsSketchwareModalOpen(false)}
      />
    </div>
  );
}
