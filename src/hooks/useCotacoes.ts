import { useState, useEffect } from "react";
import { Cotacoes } from "@/types/investimentos";

export function useCotacoes() {
  const [cotacoes, setCotacoes] = useState<Cotacoes>({ USD: 4.95, EUR: 5.35 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCotacoes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cotacoes");
      if (!response.ok) {
        throw new Error("Erro ao buscar cotações");
      }

      const data = await response.json();
      setCotacoes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      // Manter cotações padrão em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const converterMoeda = (
    valor: number,
    moeda: "BRL" | "USD" | "EUR"
  ): number => {
    if (moeda === "BRL") return valor;
    return valor * cotacoes[moeda];
  };

  const formatarMoeda = (
    valor: number,
    moeda: "BRL" | "USD" | "EUR"
  ): string => {
    const simbolos = { BRL: "R$", USD: "$", EUR: "€" };
    return `${simbolos[moeda]} ${valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  useEffect(() => {
    // Só executar no cliente para evitar problemas de hidratação
    if (typeof window !== "undefined") {
      fetchCotacoes();

      // Atualizar cotações a cada 5 minutos para dados mais atualizados
      const interval = setInterval(fetchCotacoes, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return {
    cotacoes,
    loading,
    error,
    converterMoeda,
    formatarMoeda,
    refetch: fetchCotacoes,
  };
}
