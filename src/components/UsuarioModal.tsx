"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { CreateUsuarioData, UpdateUsuarioData } from "@/hooks/useUsuarios";

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  usuario?: {
    id: string;
    email: string;
    name: string;
  };
  onSave: (data: CreateUsuarioData | UpdateUsuarioData) => Promise<void>;
}

export default function UsuarioModal({
  isOpen,
  onClose,
  mode,
  usuario,
  onSave,
}: UsuarioModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && usuario) {
      setFormData({
        email: usuario.email,
        name: usuario.name,
        password: "",
      });
    } else {
      setFormData({
        email: "",
        name: "",
        password: "",
      });
    }
    setError(null);
  }, [mode, usuario, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        await onSave({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        });
      } else {
        await onSave({
          email: formData.email,
          name: formData.name,
          ...(formData.password && { password: formData.password }),
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    formData.email.trim() &&
    formData.name.trim() &&
    (mode === "edit" ? true : formData.password.trim());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Novo Usuário" : "Editar Usuário"}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {mode === "create" ? "Senha *" : "Nova Senha (opcional)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={mode === "create"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                mode === "create"
                  ? "Senha"
                  : "Deixe em branco para manter a senha atual"
              }
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {loading ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
