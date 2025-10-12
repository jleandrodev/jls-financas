import { useState, useEffect, useCallback } from "react";
import { TransacaoInvestimento } from "@/types/investimentos";

export function useTransacoesInvestimento(investimentoId?: string) {
  const [transacoes, setTransacoes] = useState<TransacaoInvestimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacoes = useCallback(async () => {
    try {
      setLoading(true);

      // Se não há investimentoId, não buscar
      if (!investimentoId) {
        setTransacoes([]);
        return;
      }

      const url = `/api/transacoes-investimento?investimentoId=${investimentoId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar transações");
      }
      const data = await response.json();
      setTransacoes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, [investimentoId]);

  const createTransacao = async (transacao: {
    valor: number;
    descricao?: string;
    data: string;
    tipo: "APORTE" | "RESGATE" | "RENDIMENTO";
    investimentoId: string;
  }) => {
    try {
      const response = await fetch("/api/transacoes-investimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transacao),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar transação");
      }

      const novaTransacao = await response.json();
      setTransacoes((prev) => [novaTransacao, ...prev]);
      return novaTransacao;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const updateTransacao = async (
    id: string,
    transacao: {
      valor: number;
      descricao?: string;
      data: string;
      tipo: "APORTE" | "RESGATE" | "RENDIMENTO";
    }
  ) => {
    try {
      const response = await fetch(`/api/transacoes-investimento/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transacao),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar transação");
      }

      const transacaoAtualizada = await response.json();
      setTransacoes((prev) =>
        prev.map((t) => (t.id === id ? transacaoAtualizada : t))
      );
      return transacaoAtualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const deleteTransacao = async (id: string) => {
    try {
      const response = await fetch(`/api/transacoes-investimento/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir transação");
      }

      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, [investimentoId, fetchTransacoes]);

  return {
    transacoes,
    loading,
    error,
    createTransacao,
    updateTransacao,
    deleteTransacao,
    refetch: fetchTransacoes,
  };
}
