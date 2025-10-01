"use client";

import { useState, useEffect } from "react";
import { useCategorias } from "@/hooks/useCategorias";
import {
  CreateContaRecorrenteData,
  UpdateContaRecorrenteData,
  ContaRecorrente,
} from "@/types/contas-recorrentes";
import Modal from "./Modal";

interface ContaRecorrenteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateContaRecorrenteData | UpdateContaRecorrenteData
  ) => Promise<void>;
  contaRecorrente?: ContaRecorrente;
  mode: "create" | "edit";
}

export default function ContaRecorrenteModal({
  isOpen,
  onClose,
  onSave,
  contaRecorrente,
  mode,
}: ContaRecorrenteModalProps) {
  const { categorias, loading: categoriasLoading } = useCategorias();
  const [formData, setFormData] = useState({
    nome: "",
    valor: "",
    descricao: "",
    diaVencimento: "",
    categoriaId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar apenas categorias de saída para contas recorrentes
  const categoriasSaida = categorias.filter((cat) => cat.tipo === "SAIDA");

  useEffect(() => {
    if (mode === "edit" && contaRecorrente) {
      setFormData({
        nome: contaRecorrente.nome,
        valor: contaRecorrente.valor.toString(),
        descricao: contaRecorrente.descricao || "",
        diaVencimento: contaRecorrente.diaVencimento.toString(),
        categoriaId: contaRecorrente.categoriaId,
      });
    } else {
      setFormData({
        nome: "",
        valor: "",
        descricao: "",
        diaVencimento: "",
        categoriaId: "",
      });
    }
    setError(null);
  }, [mode, contaRecorrente, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        nome: formData.nome.trim(),
        valor: parseFloat(formData.valor),
        descricao: formData.descricao.trim() || undefined,
        diaVencimento: parseInt(formData.diaVencimento),
        categoriaId: formData.categoriaId,
      };

      await onSave(data);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar conta recorrente"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.nome.trim() &&
    formData.valor &&
    formData.diaVencimento &&
    formData.categoriaId;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "create" ? "Nova Conta Recorrente" : "Editar Conta Recorrente"
      }
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome da Conta *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Aluguel, Energia, Internet..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="valor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valor *
            </label>
            <input
              type="number"
              id="valor"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label
              htmlFor="diaVencimento"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Dia de Vencimento *
            </label>
            <select
              id="diaVencimento"
              name="diaVencimento"
              value={formData.diaVencimento}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione o dia</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                <option key={dia} value={dia}>
                  {dia}º dia do mês
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="categoriaId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria *
            </label>
            <select
              id="categoriaId"
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={categoriasLoading}
            >
              <option value="">Selecione uma categoria</option>
              {categoriasSaida.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição (opcional)
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Informações adicionais sobre a conta..."
              rows={3}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid || loading || categoriasLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {loading ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
