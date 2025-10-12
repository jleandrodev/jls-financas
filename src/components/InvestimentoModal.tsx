"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface Carteira {
  id: string;
  nome: string;
  descricao?: string;
}

interface InvestimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (investimento: {
    nome: string;
    descricao?: string;
    moeda: "BRL" | "USD" | "EUR";
    carteiraId: string;
  }) => void;
  carteiras: Carteira[];
  selectedCarteira?: string | null;
  initialData?: {
    id: string;
    nome: string;
    descricao?: string;
    moeda: "BRL" | "USD" | "EUR";
    carteiraId: string;
  } | null;
}

export default function InvestimentoModal({
  isOpen,
  onClose,
  onSave,
  carteiras,
  selectedCarteira,
  initialData,
}: InvestimentoModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [moeda, setMoeda] = useState<"BRL" | "USD" | "EUR">("BRL");
  const [carteiraId, setCarteiraId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNome(initialData?.nome || "");
      setDescricao(initialData?.descricao || "");
      setMoeda(initialData?.moeda || "BRL");
      setCarteiraId(initialData?.carteiraId || selectedCarteira || "");
    }
  }, [isOpen, initialData, selectedCarteira]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim() && carteiraId) {
      onSave({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        moeda,
        carteiraId,
      });
      setNome("");
      setDescricao("");
      setMoeda("BRL");
      setCarteiraId("");
      onClose();
    }
  };

  const getMoedaLabel = (moeda: string) => {
    switch (moeda) {
      case "BRL":
        return "Real (BRL)";
      case "USD":
        return "Dólar (USD)";
      case "EUR":
        return "Euro (EUR)";
      default:
        return moeda;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Investimento" : "Novo Investimento"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Investimento *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Ações da Apple"
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
            placeholder="Descrição do investimento (opcional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moeda *
          </label>
          <select
            value={moeda}
            onChange={(e) => setMoeda(e.target.value as "BRL" | "USD" | "EUR")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          >
            <option value="BRL">{getMoedaLabel("BRL")}</option>
            <option value="USD">{getMoedaLabel("USD")}</option>
            <option value="EUR">{getMoedaLabel("EUR")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carteira *
          </label>
          <select
            value={carteiraId}
            onChange={(e) => setCarteiraId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          >
            <option value="">Selecione uma carteira</option>
            {carteiras.map((carteira) => (
              <option key={carteira.id} value={carteira.id}>
                {carteira.nome}
              </option>
            ))}
          </select>
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
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            {initialData ? "Atualizar" : "Criar"} Investimento
          </button>
        </div>
      </form>
    </Modal>
  );
}
