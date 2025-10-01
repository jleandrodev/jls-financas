"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoria: { nome: string; tipo: "ENTRADA" | "SAIDA" }) => void;
  initialData?: { id: string; nome: string; tipo: "ENTRADA" | "SAIDA" } | null;
}

export default function CategoriaModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CategoriaModalProps) {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [tipo, setTipo] = useState<"ENTRADA" | "SAIDA">(
    initialData?.tipo || "SAIDA"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onSave({ nome: nome.trim(), tipo });
      setNome("");
      setTipo("SAIDA");
      onClose();
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNome(initialData?.nome || "");
      setTipo(initialData?.tipo || "SAIDA");
    }
  }, [isOpen, initialData]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Categoria" : "Nova Categoria"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Alimentação, Salário..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "ENTRADA" | "SAIDA")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="SAIDA">Saída (Gasto)</option>
            <option value="ENTRADA">Entrada (Receita)</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
