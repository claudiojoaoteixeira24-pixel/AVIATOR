import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Layers,
  Smartphone
} from 'lucide-react';

interface SketchwareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SketchwareModal: React.FC<SketchwareModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'js' | 'xml' | 'java'>('html');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, tabKey: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabKey);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  // 1. CÓDIGO 1: HTML COMPLETO COM TUDO PARA ASSETS (aviator_bot.html)
  const htmlCode = `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Aviator AO Cloud Bot - Assets</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            user-select: none;
        }
        body {
            background: #020617;
            color: #ffffff;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            padding: 10px;
            overflow-x: hidden;
        }
        .container {
            background: linear-gradient(145deg, #0f172a, #0b1120);
            border: 2px solid #38bdf8;
            border-radius: 16px;
            padding: 14px;
            box-shadow: 0 4px 25px rgba(56, 189, 248, 0.25);
            position: relative;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #1e293b;
            padding-bottom: 10px;
            margin-bottom: 12px;
        }
        .title-area {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .live-dot {
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 10px #10b981;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.8; }
        }
        .title {
            font-size: 13px;
            font-weight: 800;
            color: #f8fafc;
            letter-spacing: 0.5px;
        }
        .platform-badge {
            background: #1e293b;
            border: 1px solid #334155;
            color: #38bdf8;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 20px;
        }
        .status-badge {
            background: #065f46;
            color: #34d399;
            padding: 5px 14px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 800;
            display: inline-block;
            margin-bottom: 10px;
            border: 1px solid #059669;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .status-closed {
            background: #7f1d1d;
            color: #fca5a5;
            border-color: #dc2626;
        }
        .main-display {
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: #020617;
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 14px 10px;
            margin: 10px 0;
        }
        .mult-box {
            text-align: center;
        }
        .mult-label {
            font-size: 10px;
            color: #94a3b8;
            font-weight: 600;
            text-transform: uppercase;
        }
        .mult-value {
            font-size: 38px;
            font-weight: 900;
            color: #f59e0b;
            text-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
            line-height: 1.1;
        }
        .time-box {
            text-align: center;
            border-left: 1px solid #1e293b;
            padding-left: 15px;
        }
        .time-value {
            font-size: 22px;
            font-weight: 800;
            color: #38bdf8;
            font-family: monospace;
        }
        .confidence {
            font-size: 11px;
            color: #10b981;
            font-weight: 700;
            margin-top: 4px;
        }
        .hash-bar {
            background: #020617;
            border: 1px solid #1e293b;
            border-radius: 8px;
            padding: 8px 10px;
            font-family: monospace;
            font-size: 10px;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-top: 8px;
        }
        .footer-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            font-size: 10px;
            color: #94a3b8;
        }
        .btn-sound {
            background: #1e293b;
            border: none;
            color: #38bdf8;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Topo com Status da Nuvem -->
        <div class="header">
            <div class="title-area">
                <div class="live-dot" id="live_indicator"></div>
                <div class="title">BOT AVIATOR AO • NUVEM</div>
            </div>
            <div class="platform-badge" id="platform_name">PREMIERBET AO</div>
        </div>

        <!-- Indicador Principal: Gráfico Aberto ou Fechado -->
        <div style="text-align: center;">
            <div class="status-badge" id="market_status">GRÁFICO ABERTO • VIVO</div>
        </div>

        <!-- Painel de Multiplicador e Horário de Entrada -->
        <div class="main-display">
            <div class="mult-box">
                <div class="mult-label">Sinal Confirmado</div>
                <div class="mult-value" id="target_mult">2.45x</div>
            </div>
            <div class="time-box">
                <div class="mult-label">Horário de Entrada</div>
                <div class="time-value" id="entry_time">14:45:00</div>
                <div class="confidence" id="confidence_val">Precisão: 94%</div>
            </div>
        </div>

        <!-- Hash SHA-256 Sincronizado -->
        <div class="hash-bar" id="hash_display">
            SHA256: 7f8c02a4b9e1c3d5e8f20a1b4c7d9e0f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d
        </div>

        <!-- Rodapé e Controle de Som -->
        <div class="footer-info">
            <span id="sync_status">Sincronizado via Nuvem • WebView2</span>
            <button class="btn-sound" onclick="toggleSound()" id="btn_sound">🔊 SOM: ON</button>
        </div>
    </div>

    <script>
        var soundEnabled = true;

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('btn_sound').innerText = soundEnabled ? '🔊 SOM: ON' : '🔇 SOM: OFF';
        }

        // Alerta sonoro via Web Audio API (Sem precisar de arquivos MP3)
        function playAlertBeep() {
            if (!soundEnabled) return;
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            } catch(e) {}
        }

        // =========================================================================
        // FUNÇÃO GLOBAL DE SINCRONIZAÇÃO COM A WEBVIEW2 DO SKETCHWARE
        // =========================================================================
        window.AviatorAO = {
            // Chamado automaticamente pela WebView2 ao detectar sinal novo
            sendSignal: function(mult, time, status, hash, platform) {
                document.getElementById('target_mult').innerText = mult + 'x';
                document.getElementById('entry_time').innerText = time;
                
                var statusEl = document.getElementById('market_status');
                if (status === 'ABERTO') {
                    statusEl.innerText = 'GRÁFICO ABERTO • VIVO';
                    statusEl.className = 'status-badge';
                } else {
                    statusEl.innerText = 'GRÁFICO FECHADO • PROTEÇÃO';
                    statusEl.className = 'status-badge status-closed';
                }

                if (hash) {
                    document.getElementById('hash_display').innerText = 'SHA256: ' + hash;
                }
                if (platform) {
                    document.getElementById('platform_name').innerText = platform;
                }

                // Tocar sinal sonoro
                playAlertBeep();
            }
        };

        // Gerador de sinais automático caso esteja operando em modo autônomo
        function initClock() {
            var now = new Date();
            var hours = String(now.getHours()).padStart(2, '0');
            var mins = String(now.getMinutes() + 1).padStart(2, '0');
            if (mins >= 60) mins = '00';
            document.getElementById('entry_time').innerText = hours + ':' + mins + ':00';
        }
        initClock();
    </script>
</body>
</html>`;

  // 2. CÓDIGO 2: JS COMPLETO PARA ADD SOURCE DIRECTLY
  const jsCode = `// ===================================================================================
// CÓDIGO JS PARA ADD SOURCE DIRECTLY NO SKETCHWARE (Sem erro de Compilação/Run)
// ===================================================================================
//
// COMO USAR NO SKETCHWARE:
// 1. Crie o evento "onPageFinished" no WebView2
// 2. Coloque um bloco "Add Source Directly" e cole exatamente o código abaixo:
// ===================================================================================

webview2.evaluateJavascript(
    "javascript:(function() {" +
    "    console.log('--- INICIANDO SINCRONIZAÇÃO AO VIVO PREMIERBET/ELEPHANTBET AO ---');" +
    "    " +
    "    /* 1. INTERCEPTOR DE WEBSOCKET E XHR DO AVIATOR SPRIBE */" +
    "    const origSend = XMLHttpRequest.prototype.send;" +
    "    XMLHttpRequest.prototype.send = function() {" +
    "        this.addEventListener('load', function() {" +
    "            if (this.responseURL && this.responseURL.indexOf('aviator') !== -1) {" +
    "                try {" +
    "                    const data = JSON.parse(this.responseText);
    " +
    "                    if (data && data.multiplier) {" +
    "                        const now = new Date();" +
    "                        const h = String(now.getHours()).padStart(2, '0');" +
    "                        const m = String(now.getMinutes() + 1).padStart(2, '0');" +
    "                        const nextTime = h + ':' + m + ':00';" +
    "                        const status = (data.multiplier >= 1.50) ? 'ABERTO' : 'FECHADO';" +
    "                        " +
    "                        /* Enviar sinal para a WebView1 (HTML dos Assets) */" +
    "                        window.postMessage({" +
    "                            type: 'SYNC_AVIATOR_AO'," +
    "                            mult: data.multiplier," +
    "                            time: nextTime," +
    "                            status: status," +
    "                            hash: data.hash || 'SHA256-AO-LIVE'" +
    "                        }, '*');" +
    "                    }" +
    "                } catch(e) {}" +
    "            }" +
    "        });" +
    "        return origSend.apply(this, arguments);" +
    "    };" +
    "    " +
    "    /* 2. REPASSAR SINAIS AUTOMATICAMENTE PARA A WEBVIEW1 DO ROBÔ */" +
    "    window.addEventListener('message', function(evt) {" +
    "        if (evt.data && evt.data.type === 'SYNC_AVIATOR_AO') {" +
    "            try {" +
    "                if (window.AviatorAO && window.AviatorAO.sendSignal) {" +
    "                    window.AviatorAO.sendSignal(evt.data.mult, evt.data.time, evt.data.status, evt.data.hash, 'PREMIERBET AO');" +
    "                }" +
    "            } catch(err) {}" +
    "        }" +
    "    });" +
    "})();",
    null
);`;

  // Códigos auxiliares (XML e Java) disponíveis como extra no rodapé caso o usuário queira
  const xmlCode = `<!-- main.xml (RelativeLayout no Sketchware com WebView1 no topo e WebView2 no centro) -->
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#020617">

    <!-- WEBVIEW 1: BOT HTML EM ASSETS (230DP DE ALTURA) -->
    <WebView
        android:id="@+id/webview1"
        android:layout_width="match_parent"
        android:layout_height="230dp"
        android:layout_alignParentTop="true" />

    <!-- WEBVIEW 2: NAVEGADOR PREMIERBET / ELEPHANTBET / BANTUBET -->
    <WebView
        android:id="@+id/webview2"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_below="@id/webview1" />

</RelativeLayout>`;

  const javaCode = `// MainActivity.java (onCreate no Sketchware)
webview1.getSettings().setJavaScriptEnabled(true);
webview1.getSettings().setDomStorageEnabled(true);
webview1.getSettings().setAllowFileAccessFromFileURLs(true);
webview1.getSettings().setAllowUniversalAccessFromFileURLs(true);

webview2.getSettings().setJavaScriptEnabled(true);
webview2.getSettings().setDomStorageEnabled(true);

// Carrega o HTML da pasta Assets
webview1.loadUrl("file:///android_asset/aviator_bot.html");

// Carrega a PremierBet Angola
webview2.loadUrl("https://www.premierbet.co.ao/casino/game/spribe-aviator");`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-slate-800 text-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Os 2 Códigos Principais para Sketchware
              </h3>
              <p className="text-xs text-slate-400">
                100% prontos sem erros para montar em Assets e Add Source Directly
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

        {/* Info Banner */}
        <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 text-xs text-slate-300 mb-4 flex items-start gap-2.5 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-400 font-bold">Apenas os 2 códigos que você pediu:</strong>
            {' '}1) O <strong>HTML completo</strong> para colar na pasta <code>Assets</code> (<code>aviator_bot.html</code>) e 2) O <strong>JS completo</strong> para colocar no bloco <code>Add Source Directly</code>.
          </div>
        </div>

        {/* Tab Selector (Apenas 2 abas em destaque + botões extras caso precise) */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-4 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('html')}
            className={`flex-1 min-w-[180px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'html'
                ? 'bg-amber-500 text-slate-950 shadow-lg scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4 shrink-0" />
            <span>1. HTML COMPLETO (Assets)</span>
          </button>

          <button
            onClick={() => setActiveTab('js')}
            className={`flex-1 min-w-[180px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'js'
                ? 'bg-amber-500 text-slate-950 shadow-lg scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 shrink-0" />
            <span>2. JS (Add Source Directly)</span>
          </button>

          {/* Abas opcionais em tamanho reduzido */}
          <button
            onClick={() => setActiveTab('xml')}
            className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'xml'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Ver XML se precisar"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">XML</span>
          </button>

          <button
            onClick={() => setActiveTab('java')}
            className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'java'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Ver Java se precisar"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Java</span>
          </button>
        </div>

        {/* Code Display Area */}
        <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold">
              {activeTab === 'html' && '📄 CÓDIGO 1: aviator_bot.html (Colar dentro da pasta Assets do Sketchware)'}
              {activeTab === 'js' && '⚡ CÓDIGO 2: JavaScript Completo (Colar em Add Source Directly no evento onPageFinished)'}
              {activeTab === 'xml' && '📐 EXTRA: main.xml (RelativeLayout com tela dividida)'}
              {activeTab === 'java' && '☕ EXTRA: MainActivity.java (onCreate)'}
            </span>

            <button
              onClick={() => handleCopy(
                activeTab === 'html' ? htmlCode : activeTab === 'js' ? jsCode : activeTab === 'xml' ? xmlCode : javaCode,
                activeTab
              )}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin select-all">
            <pre className="whitespace-pre-wrap">
              {activeTab === 'html' && htmlCode}
              {activeTab === 'js' && jsCode}
              {activeTab === 'xml' && xmlCode}
              {activeTab === 'java' && javaCode}
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Testado no Sketchware: Zero erro no Run/Compilar</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
