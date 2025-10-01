import { useState, useEffect, useCallback } from "react";

export interface DashboardData {
  saldo: number;
  entradas: number;
  saidas: number;
  gastoDiarioPermitido: number;
  diasRestantes: number;
  transacoesPorCategoria: Array<{
    categoria: string;
    valor: number;
    tipo: string;
  }>;
  transacoesPorMes: Array<{
    mes: string;
    entradas: number;
    saidas: number;
  }>;
  transacoesPorDia: Array<{
    dia: string;
    entradas: number;
    saidas: number;
  }>;
  ultimasTransacoes: Array<{
    id: string;
    valor: number;
    descricao: string | null;
    data: string;
    categoria: {
      id: string;
      nome: string;
      tipo: "ENTRADA" | "SAIDA";
    };
  }>;
}

export function useDashboard(mesSelecionado?: string) {
  const [data, setData] = useState<DashboardData>({
    saldo: 0,
    entradas: 0,
    saidas: 0,
    gastoDiarioPermitido: 0,
    diasRestantes: 0,
    transacoesPorCategoria: [],
    transacoesPorMes: [],
    transacoesPorDia: [],
    ultimasTransacoes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url =
        mesSelecionado && mesSelecionado !== "todos"
          ? `/api/dashboard?mes=${mesSelecionado}`
          : "/api/dashboard";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do dashboard");
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [mesSelecionado]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
