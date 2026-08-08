export type PlatformId = 'premierbet' | 'elephantbet' | 'bantubet';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  badge: string;
  logo: string;
  color: string;
  bgGradient: string;
  url: string;
  aviatorDirectUrl: string;
  description: string;
  cloudSyncLatencyMs: number;
}

export type MarketStatus = 'ABERTO' | 'ALERTA' | 'FECHADO';

export type StrategyType = 'conservative' | 'moderate' | 'pink_hunter';

export interface StrategyConfig {
  id: StrategyType;
  name: string;
  targetRange: string;
  minTarget: number;
  maxTarget: number;
  minConfidence: number;
  badgeColor: string;
}

export interface SignalData {
  id: string;
  platformId: PlatformId;
  timestamp: string; // HH:MM:SS format
  entryTime: string; // HH:MM:SS exact planned execution
  timeRemainingSeconds: number;
  marketStatus: MarketStatus;
  confidence: number;
  targetMultiplier: number;
  stopLoss: number;
  recommendedAttempts: number;
  hashVerification: string;
  reasoning: string;
  strategy: StrategyType;
  status: 'PENDING' | 'WIN' | 'LOSS';
  actualMultiplier?: number;
}

export type LayoutMode = 'split' | 'overlay' | 'bot_only' | 'browser_only';
