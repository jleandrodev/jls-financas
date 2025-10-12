"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";

interface Investimento {
  id: string;
  nome: string;
  moeda: "BRL" | "USD" | "EUR";
  carteira: {
    id: string;
    nome: string;
  };
}

interface TransacaoInvestimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transacao: {
    valor: number;
    descricao?: string;
    data: string;
    tipo: "APORTE" | "RESGATE" | "RENDIMENTO";
    investimentoId: string;
  }) => void;
  investimentos: Investimento[];
  selectedInvestimento?: string | null;
  initialData?: {
    id: string;
    valor: number;
    descricao?: string;
    data: string;
    tipo: "APORTE" | "RESGATE" | "RENDIMENTO";
    investimentoId: string;
  } | null;
}

export default function TransacaoInvestimentoModal({
  isOpen,
  onClose,
  onSave,
  investimentos,
  selectedInvestimento,
  initialData,
}: TransacaoInvestimentoModalProps) {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [tipo, setTipo] = useState<"APORTE" | "RESGATE" | "RENDIMENTO">(
    "APORTE"
  );
  const [investimentoId, setInvestimentoId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValor(initialData?.valor.toString() || "");
      setDescricao(initialData?.descricao || "");
      setData(initialData?.data || new Date().toISOString().split("T")[0]);
      setTipo(initialData?.tipo || "APORTE");
      setInvestimentoId(
        initialData?.investimentoId || selectedInvestimento || ""
      );
    }
  }, [isOpen, initialData, selectedInvestimento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valor && investimentoId) {
      onSave({
        valor: parseFloat(valor),
        descricao: descricao.trim() || undefined,
        data,
        tipo,
        investimentoId,
      });
      setValor("");
      setDescricao("");
      setData(new Date().toISOString().split("T")[0]);
      setTipo("APORTE");
      setInvestimentoId("");
      onClose();
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "APORTE":
        return "Aporte";
      case "RESGATE":
        return "Resgate";
      case "RENDIMENTO":
        return "Rendimento";
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "APORTE":
        return "text-green-600";
      case "RESGATE":
        return "text-red-600";
      case "RENDIMENTO":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Transação" : "Nova Transação"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investimento *
          </label>
          <select
            value={investimentoId}
            onChange={(e) => setInvestimentoId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          >
            <option value="">Selecione um investimento</option>
            {investimentos.map((investimento) => (
              <option key={investimento.id} value={investimento.id}>
                {investimento.nome} -{" "}
                {investimento.carteira?.nome || "Carteira não encontrada"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Transação *
          </label>
          <select
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value as "APORTE" | "RESGATE" | "RENDIMENTO")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          >
            <option value="APORTE">{getTipoLabel("APORTE")}</option>
            <option value="RESGATE">{getTipoLabel("RESGATE")}</option>
            <option value="RENDIMENTO">{getTipoLabel("RENDIMENTO")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor *
          </label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data *
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
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
            placeholder="Descrição da transação (opcional)"
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
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            {initialData ? "Atualizar" : "Criar"} Transação
          </button>
        </div>
      </form>
    </Modal>
  );
}
