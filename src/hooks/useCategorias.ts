import { useState, useEffect } from "react";

export interface Categoria {
  id: string;
  nome: string;
  tipo: "ENTRADA" | "SAIDA";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/categorias");

      if (!response.ok) {
        throw new Error("Erro ao buscar categorias");
      }

      const data = await response.json();
      setCategorias(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const createCategoria = async (categoria: {
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  }) => {
    try {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar categoria");
      }

      const novaCategoria = await response.json();
      setCategorias((prev) => [...prev, novaCategoria]);
      return novaCategoria;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const updateCategoria = async (
    id: string,
    categoria: { nome: string; tipo: "ENTRADA" | "SAIDA" }
  ) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar categoria");
      }

      const categoriaAtualizada = await response.json();
      setCategorias((prev) =>
        prev.map((c) => (c.id === id ? categoriaAtualizada : c))
      );
      return categoriaAtualizada;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  const deleteCategoria = async (id: string) => {
    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao deletar categoria");
      }

      setCategorias((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      throw err;
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    refetch: fetchCategorias,
  };
}
