"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import CategoriaModal from "./CategoriaModal";
import { useContasRecorrentes } from "@/hooks/useContasRecorrentes";

interface Categoria {
  id: string;
  nome: string;
  tipo: "ENTRADA" | "SAIDA";
}

interface TransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transacao: {
    valor: number;
    descricao: string;
    data: string;
    categoriaId: string;
    contaRecorrenteId?: string;
    isParcelada?: boolean;
    numeroParcelas?: number;
  }) => void;
  categorias: Categoria[];
  onCategoriaSave: (categoria: {
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  }) => void;
  initialData?: {
    id: string;
    valor: number;
    descricao: string;
    data: string;
    categoriaId: string;
    contaRecorrenteId?: string;
  } | null;
}

export default function TransacaoModal({
  isOpen,
  onClose,
  onSave,
  categorias,
  onCategoriaSave,
  initialData,
}: TransacaoModalProps) {
  const { contasRecorrentes } = useContasRecorrentes();
  const [valor, setValor] = useState(initialData?.valor.toString() || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [data, setData] = useState(
    initialData?.data || new Date().toISOString().split("T")[0]
  );
  const [categoriaId, setCategoriaId] = useState(
    initialData?.categoriaId || ""
  );
  const [contaRecorrenteId, setContaRecorrenteId] = useState(
    initialData?.contaRecorrenteId || ""
  );
  const [isParcelada, setIsParcelada] = useState(false);
  const [numeroParcelas, setNumeroParcelas] = useState(2);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);

  useEffect(() => {
    if (categorias.length > 0 && !categoriaId) {
      setCategoriaId(categorias[0].id);
    }
  }, [categorias, categoriaId]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setValor(initialData?.valor.toString() || "");
      setDescricao(initialData?.descricao || "");
      setData(initialData?.data || new Date().toISOString().split("T")[0]);
      setCategoriaId(initialData?.categoriaId || "");
      setContaRecorrenteId(initialData?.contaRecorrenteId || "");
      setIsParcelada(false);
      setNumeroParcelas(2);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valor && categoriaId) {
      onSave({
        valor: parseFloat(valor),
        descricao: descricao.trim(),
        data,
        categoriaId,
        contaRecorrenteId: contaRecorrenteId || undefined,
        isParcelada,
        numeroParcelas: isParcelada ? numeroParcelas : undefined,
      });
      setValor("");
      setDescricao("");
      setData(new Date().toISOString().split("T")[0]);
      setCategoriaId("");
      setContaRecorrenteId("");
      setIsParcelada(false);
      setNumeroParcelas(2);
      onClose();
    }
  };

  const handleCategoriaSave = (categoria: {
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  }) => {
    onCategoriaSave(categoria);
    setShowCategoriaModal(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? "Editar Transação" : "Nova Transação"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição da transação"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <div className="flex space-x-2">
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome} (
                    {categoria.tipo === "ENTRADA" ? "Entrada" : "Saída"})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoriaModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
              >
                + Nova
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conta Recorrente (opcional)
            </label>
            <select
              value={contaRecorrenteId}
              onChange={(e) => setContaRecorrenteId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nenhuma conta recorrente</option>
              {contasRecorrentes
                .filter(({ conta }) => conta.ativo)
                .map(({ conta }) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome} - {conta.categoria.nome}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Vincule esta transação a uma conta recorrente para marcar como
              paga
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="isParcelada"
                checked={isParcelada}
                onChange={(e) => setIsParcelada(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isParcelada"
                className="text-sm font-medium text-gray-700"
              >
                Transação Parcelada
              </label>
            </div>
            {isParcelada && (
              <div className="ml-6 space-y-2">
                <div>
                  <label
                    htmlFor="numeroParcelas"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número de Parcelas
                  </label>
                  <select
                    id="numeroParcelas"
                    value={numeroParcelas}
                    onChange={(e) =>
                      setNumeroParcelas(parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 2).map((num) => (
                      <option key={num} value={num}>
                        {num}x parcelas
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Resumo:</strong> {numeroParcelas}x de{" "}
                    {formatCurrency(parseFloat(valor || "0") / numeroParcelas)}
                    {valor && (
                      <span className="block text-xs text-blue-600 mt-1">
                        Total: {formatCurrency(parseFloat(valor))}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
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

      <CategoriaModal
        isOpen={showCategoriaModal}
        onClose={() => setShowCategoriaModal(false)}
        onSave={handleCategoriaSave}
      />
    </>
  );
}
