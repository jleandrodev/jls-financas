"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface CarteiraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carteira: { nome: string; descricao?: string }) => void;
  initialData?: {
    id: string;
    nome: string;
    descricao?: string;
  } | null;
}

export default function CarteiraModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CarteiraModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome(initialData?.nome || "");
      setDescricao(initialData?.descricao || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onSave({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
      });
      setNome("");
      setDescricao("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Carteira" : "Nova Carteira"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Carteira *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Carteira Principal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição da carteira (opcional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            {initialData ? "Atualizar" : "Criar"} Carteira
          </button>
        </div>
      </form>
    </Modal>
  );
}
