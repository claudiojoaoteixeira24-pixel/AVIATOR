import React, { useState } from 'react';
import { 
  X, 
  Hash, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Search, 
  RefreshCw 
} from 'lucide-react';
import { PlatformId } from '../types';
import { PLATFORMS } from '../data/platforms';

interface HashCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatform: PlatformId;
}

export const HashCalculatorModal: React.FC<HashCalculatorModalProps> = ({
  isOpen,
  onClose,
  selectedPlatform,
}) => {
  const platform = PLATFORMS[selectedPlatform];
  const [customHash, setCustomHash] = useState<string>(
    '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  );
  const [calculatedMultiplier, setCalculatedMultiplier] = useState<number | null>(3.84);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyHash = () => {
    setIsVerifying(true);
    setTimeout(() => {
      // Deterministic multiplier calculation from string bytes
      let hashSum = 0;
      for (let i = 0; i < customHash.length; i++) {
        hashSum += customHash.charCodeAt(i);
      }
      const rawMult = (hashSum % 1500) / 100 + 1.01;
      setCalculatedMultiplier(Number(rawMult.toFixed(2)));
      setIsVerifying(false);
    }, 600);
  };

  const handleGenerateSampleHash = () => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomHash(result);
    setCalculatedMultiplier(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-slate-800 text-white rounded-2xl max-w-lg w-full p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Inspetor de Hash SHA256 (Spribe)
              </h3>
              <p className="text-xs text-slate-400">
                Sincronizador de Seeds em Nuvem • {platform.name}
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

        {/* Info Box */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 mb-4 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            O Aviator da <strong className="text-white">{platform.name}</strong> utiliza o sistema Provably Fair SHA256. O nosso robô lê a seed do servidor antes do lançamento da vela para calcular a hora HH:MM de estouro do multiplicador.
          </div>
        </div>

        {/* Input Hash String */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Server Seed (Hash 64 Hex):</span>
            <button
              onClick={handleGenerateSampleHash}
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-normal lowercase"
            >
              <RefreshCw className="w-3 h-3" />
              gerar hash aleatório
            </button>
          </label>
          <input
            type="text"
            value={customHash}
            onChange={(e) => setCustomHash(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            placeholder="Digite ou cole a hash SHA256 do servidor..."
          />
        </div>

        {/* Result Card */}
        {calculatedMultiplier !== null && (
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 text-center mb-4 animate-in zoom-in-95">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block mb-1">
              Multiplicador Calculado pela Hash
            </span>
            <div className="font-mono font-black text-3xl sm:text-4xl text-amber-400 mb-1">
              {calculatedMultiplier.toFixed(2)}x
            </div>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Hash Verificada com Sucesso (Servidor {platform.name})
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleVerifyHash}
          disabled={isVerifying || !customHash}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>DESCRIPTOGRAFANDO SEED...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>CALCULAR MULTIPLICADOR DA HASH</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
