import { useState, useEffect, useCallback } from "react";

export interface Transacao {
  id: string;
  valor: number;
  descricao: string | null;
  data: string;
  categoriaId: string;
  userId: string;
  contaRecorrenteId?: string | null;
  createdAt: string;
  updatedAt: string;
  categoria: {
    id: string;
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  };
  contaRecorrente?: {
    id: string;
    nome: string;
    valor: number;
  } | null;
}

export interface TransacaoFilters {
  categoriaId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export function useTransacoes(filters?: TransacaoFilters) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransacoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.categoriaId)
        params.append("categoriaId", filters.categoriaId);
      if (filters?.dataInicio) params.append("dataInicio", filters.dataInicio);
      if (filters?.dataFim) params.append("dataFim", filters.dataFim);

      const response = await fetch(`/api/transacoes?${params.toString()}`);

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
  }, [filters?.categoriaId, filters?.dataInicio, filters?.dataFim]);

  const createTransacao = async (transacao: {
    valor: number;
    descricao: string;
    data: string;
    categoriaId: string;
    contaRecorrenteId?: string;
    isParcelada?: boolean;
    numeroParcelas?: number;
  }) => {
    try {
      const response = await fetch("/api/transacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transacao),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar transação");
      }

      const resultado = await response.json();

      // Se for transação parcelada, adicionar todas as parcelas
      if (resultado.transacoes) {
        setTransacoes((prev) => [...resultado.transacoes, ...prev]);
        return resultado;
      } else {
        // Transação única
        setTransacoes((prev) => [resultado, ...prev]);
        return resultado;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const updateTransacao = async (
    id: string,
    transacao: {
      valor: number;
      descricao: string;
      data: string;
      categoriaId: string;
      contaRecorrenteId?: string;
    }
  ) => {
    try {
      const response = await fetch(`/api/transacoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transacao),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar transação");
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
      const response = await fetch(`/api/transacoes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao deletar transação");
      }

      setTransacoes((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, [
    filters?.categoriaId,
    filters?.dataInicio,
    filters?.dataFim,
    fetchTransacoes,
  ]);

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
