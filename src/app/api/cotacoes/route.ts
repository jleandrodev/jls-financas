import { NextResponse } from "next/server";

// Cache para cotações com TTL de 5 minutos
let cotacoesCache: {
  data: Date;
  cotacoes: {
    USD: number;
    EUR: number;
  };
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function GET() {
  try {
    const now = new Date();

    // Verificar se o cache ainda é válido
    if (
      cotacoesCache &&
      now.getTime() - cotacoesCache.data.getTime() < CACHE_DURATION
    ) {
      return NextResponse.json(cotacoesCache.cotacoes);
    }

    // Buscar cotações em tempo real da API do Banco Central do Brasil
    const [usdResponse, eurResponse] = await Promise.all([
      fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json"
      ),
      fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.21619/dados/ultimos/1?formato=json"
      ),
    ]);

    if (usdResponse.ok && eurResponse.ok) {
      const [usdData, eurData] = await Promise.all([
        usdResponse.json(),
        eurResponse.json(),
      ]);

      const cotacoes = {
        USD: parseFloat(usdData[0]?.valor || "4.95"),
        EUR: parseFloat(eurData[0]?.valor || "5.35"),
      };

      // Atualizar cache
      cotacoesCache = {
        data: now,
        cotacoes,
      };

      return NextResponse.json(cotacoes);
    }

    // Fallback para API alternativa (ExchangeRate-API)
    const fallbackResponse = await fetch(
      "https://api.exchangerate-api.com/v4/latest/BRL"
    );

    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json();
      const cotacoes = {
        USD: 1 / data.rates.USD, // Converter de BRL para USD
        EUR: 1 / data.rates.EUR, // Converter de BRL para EUR
      };

      // Atualizar cache
      cotacoesCache = {
        data: now,
        cotacoes,
      };

      return NextResponse.json(cotacoes);
    }

    // Se todas as APIs falharem, usar valores padrão
    const fallbackCotacoes = {
      USD: 4.95,
      EUR: 5.35,
    };

    return NextResponse.json(fallbackCotacoes);
  } catch (error) {
    console.error("Erro ao buscar cotações:", error);

    // Fallback para cotações fixas em caso de erro
    const fallbackCotacoes = {
      USD: 4.95,
      EUR: 5.35,
    };

    return NextResponse.json(fallbackCotacoes);
  }
}
