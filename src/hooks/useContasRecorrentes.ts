import { useState, useEffect } from "react";
import {
  ContaRecorrente,
  CreateContaRecorrenteData,
  UpdateContaRecorrenteData,
  ContaRecorrenteStatus,
} from "@/types/contas-recorrentes";

export function useContasRecorrentes() {
  const [contasRecorrentes, setContasRecorrentes] = useState<
    ContaRecorrenteStatus[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContasRecorrentes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/contas-recorrentes");

      if (!response.ok) {
        throw new Error("Erro ao carregar contas recorrentes");
      }

      const data = await response.json();
      setContasRecorrentes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const createContaRecorrente = async (
    data: CreateContaRecorrenteData
  ): Promise<ContaRecorrente> => {
    const response = await fetch("/api/contas-recorrentes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao criar conta recorrente");
    }

    const novaConta = await response.json();
    await fetchContasRecorrentes(); // Recarregar a lista
    return novaConta;
  };

  const updateContaRecorrente = async (
    id: string,
    data: UpdateContaRecorrenteData
  ): Promise<ContaRecorrente> => {
    const response = await fetch(`/api/contas-recorrentes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao atualizar conta recorrente");
    }

    const contaAtualizada = await response.json();
    await fetchContasRecorrentes(); // Recarregar a lista
    return contaAtualizada;
  };

  const deleteContaRecorrente = async (id: string): Promise<void> => {
    const response = await fetch(`/api/contas-recorrentes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao excluir conta recorrente");
    }

    await fetchContasRecorrentes(); // Recarregar a lista
  };

  const toggleContaAtiva = async (
    id: string,
    ativo: boolean
  ): Promise<void> => {
    await updateContaRecorrente(id, { ativo });
  };

  useEffect(() => {
    fetchContasRecorrentes();
  }, []);

  return {
    contasRecorrentes,
    loading,
    error,
    createContaRecorrente,
    updateContaRecorrente,
    deleteContaRecorrente,
    toggleContaAtiva,
    refetch: fetchContasRecorrentes,
  };
}
