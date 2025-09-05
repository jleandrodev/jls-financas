import { useState, useEffect, useCallback } from "react";

export interface TransacaoPorDia {
  dia: string;
  entradas: number;
  saidas: number;
}

export function useTransacoesPorDia(mes: string) {
  const [data, setData] = useState<TransacaoPorDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacoesPorDia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/dashboard/transacoes-por-dia?mes=${mes}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar transações por dia");
      }

      const transacoesPorDia = await response.json();
      setData(transacoesPorDia);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [mes]);

  useEffect(() => {
    if (mes) {
      fetchTransacoesPorDia();
    }
  }, [mes, fetchTransacoesPorDia]);

  return {
    data,
    loading,
    error,
    refetch: fetchTransacoesPorDia,
  };
}
