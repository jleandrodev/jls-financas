"use client";

import { useState, useEffect } from "react";

export interface Usuario {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignIn: string | null;
  emailConfirmed: boolean;
}

export interface CreateUsuarioData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUsuarioData {
  email: string;
  name: string;
  password?: string;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/usuarios");

      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }

      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (usuarioData: CreateUsuarioData) => {
    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar usuário");
      }

      const data = await response.json();
      await fetchUsuarios(); // Recarregar lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateUsuario = async (id: string, usuarioData: UpdateUsuarioData) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar usuário");
      }

      const data = await response.json();
      await fetchUsuarios(); // Recarregar lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteUsuario = async (id: string) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao excluir usuário");
      }

      const data = await response.json();
      await fetchUsuarios(); // Recarregar lista
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    refetch: fetchUsuarios,
  };
}
