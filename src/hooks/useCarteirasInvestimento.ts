import { useState, useEffect } from "react";
import { CarteiraInvestimento } from "@/types/investimentos";

export function useCarteirasInvestimento() {
  const [carteiras, setCarteiras] = useState<CarteiraInvestimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarteiras = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/carteiras-investimento");
      if (!response.ok) {
        throw new Error("Erro ao buscar carteiras");
      }
      const data = await response.json();
      setCarteiras(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const createCarteira = async (carteira: {
    nome: string;
    descricao?: string;
  }) => {
    try {
      const response = await fetch("/api/carteiras-investimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carteira),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar carteira");
      }

      const novaCarteira = await response.json();
      setCarteiras((prev) => [novaCarteira, ...prev]);
      return novaCarteira;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const updateCarteira = async (
    id: string,
    carteira: {
      nome: string;
      descricao?: string;
      ativo?: boolean;
    }
  ) => {
    try {
      const response = await fetch(`/api/carteiras-investimento/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carteira),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar carteira");
      }

      const carteiraAtualizada = await response.json();
      setCarteiras((prev) =>
        prev.map((c) => (c.id === id ? carteiraAtualizada : c))
      );
      return carteiraAtualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const deleteCarteira = async (id: string) => {
    try {
      const response = await fetch(`/api/carteiras-investimento/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir carteira");
      }

      setCarteiras((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  useEffect(() => {
    fetchCarteiras();
  }, []);

  return {
    carteiras,
    loading,
    error,
    createCarteira,
    updateCarteira,
    deleteCarteira,
    refetch: fetchCarteiras,
  };
}
