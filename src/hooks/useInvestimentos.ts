import { useState, useEffect, useCallback } from "react";
import { Investimento } from "@/types/investimentos";

export function useInvestimentos(carteiraId?: string) {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestimentos = useCallback(async () => {
    try {
      setLoading(true);
      const url = carteiraId
        ? `/api/investimentos?carteiraId=${carteiraId}`
        : "/api/investimentos";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar investimentos");
      }
      const data = await response.json();
      setInvestimentos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [carteiraId]);

  const createInvestimento = async (investimento: {
    nome: string;
    descricao?: string;
    moeda: "BRL" | "USD" | "EUR";
    carteiraId: string;
  }) => {
    try {
      const response = await fetch("/api/investimentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(investimento),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar investimento");
      }

      const novoInvestimento = await response.json();
      setInvestimentos((prev) => [novoInvestimento, ...prev]);
      return novoInvestimento;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const updateInvestimento = async (
    id: string,
    investimento: {
      nome: string;
      descricao?: string;
      moeda: "BRL" | "USD" | "EUR";
      ativo?: boolean;
    }
  ) => {
    try {
      const response = await fetch(`/api/investimentos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(investimento),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar investimento");
      }

      const investimentoAtualizado = await response.json();
      setInvestimentos((prev) =>
        prev.map((i) => (i.id === id ? investimentoAtualizado : i))
      );
      return investimentoAtualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const deleteInvestimento = async (id: string) => {
    try {
      const response = await fetch(`/api/investimentos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir investimento");
      }

      setInvestimentos((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  useEffect(() => {
    fetchInvestimentos();
  }, [carteiraId, fetchInvestimentos]);

  return {
    investimentos,
    loading,
    error,
    createInvestimento,
    updateInvestimento,
    deleteInvestimento,
    refetch: fetchInvestimentos,
  };
}
