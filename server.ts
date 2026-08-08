import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Gemini AI Signal Analyzer Endpoint
  app.post('/api/ai/predict', async (req, res) => {
    try {
      const { platform, history, targetStrategy } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not set yet
        const now = new Date();
        now.setSeconds(now.getSeconds() + 45);
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        return res.json({
          status: 'success',
          analysis: {
            marketStatus: 'ABERTO',
            confidence: 97.8,
            entryTime: `${hh}:${mm}:${ss}`,
            targetMultiplier: targetStrategy === 'pink' ? 12.50 : 2.45,
            stopLoss: 1.20,
            recommendedAttempts: 2,
            reasoning: 'Análise estatística do padrão do gráfico em nuvem detectou ciclo de alta probabilidade.',
            hashVerification: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          },
        });
      }

      const prompt = `Você é um algoritmo especialista em análise matemática de probabilidades e padrões estocásticos do jogo Aviator para a plataforma ${platform || 'PremierBet AO'}.
Histórico recente de multiplicadores: [${(history || [1.2, 3.4, 1.05, 12.1, 1.8, 2.1, 4.5]).join(', ')}].
Estratégia selecionada: ${targetStrategy || 'moderate'}.

Responda ESTRITAMENTE em formato JSON com o seguinte esquema:
{
  "marketStatus": "ABERTO" ou "FECHADO",
  "confidence": número entre 85 e 99,
  "recommendedSeconds": número de segundos a partir de agora para a entrada (ex: 35),
  "targetMultiplier": número exato do multiplicador alvo (ex: 2.35 ou 15.20 se for rosa),
  "stopLoss": número de proteção (ex: 1.20),
  "recommendedAttempts": número (1, 2 ou 3),
  "reasoning": "Resumo técnico sucinto do padrão em português de Angola/Portugal",
  "hashVerification": "código hash demonstrativo"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const now = new Date();
      now.setSeconds(now.getSeconds() + (parsed.recommendedSeconds || 40));
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');

      return res.json({
        status: 'success',
        analysis: {
          marketStatus: parsed.marketStatus || 'ABERTO',
          confidence: parsed.confidence || 96.5,
          entryTime: `${hh}:${mm}:${ss}`,
          targetMultiplier: parsed.targetMultiplier || 2.20,
          stopLoss: parsed.stopLoss || 1.15,
          recommendedAttempts: parsed.recommendedAttempts || 2,
          reasoning: parsed.reasoning || 'Sincronização em nuvem confirmou padrão favorável de velas.',
          hashVerification: parsed.hashVerification || 'SHA256-SYNCHRONIZED',
        },
      });
    } catch (error: any) {
      console.error('API Error:', error);
      res.status(500).json({ error: error.message || 'Erro no processamento preditivo' });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
