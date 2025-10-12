"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useTransacoesInvestimento } from "@/hooks/useTransacoesInvestimento";
import { useCotacoes } from "@/hooks/useCotacoes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Plus,
} from "lucide-react";

interface TransacoesInvestimentoListModalProps {
  isOpen: boolean;
  onClose: () => void;
  investimento: {
    id: string;
    nome: string;
    moeda: "BRL" | "USD" | "EUR";
  } | null;
  onEditTransacao: (transacao: any) => void;
  onDeleteTransacao: (transacaoId: string) => void;
  onAddTransacao: () => void;
}

export default function TransacoesInvestimentoListModal({
  isOpen,
  onClose,
  investimento,
  onEditTransacao,
  onDeleteTransacao,
  onAddTransacao,
}: TransacoesInvestimentoListModalProps) {
  const { transacoes, loading, deleteTransacao } = useTransacoesInvestimento(
    investimento?.id
  );
  const { formatarMoeda } = useCotacoes();

  // Se não há investimento, não renderizar
  if (!investimento) {
    return null;
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "APORTE":
        return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case "RESGATE":
        return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case "RENDIMENTO":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return null;
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
        return "bg-green-100 text-green-700";
      case "RESGATE":
        return "bg-red-100 text-red-700";
      case "RENDIMENTO":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = async (transacaoId: string) => {
    try {
      if (confirm("Tem certeza que deseja excluir esta transação?")) {
        await deleteTransacao(transacaoId);
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação. Tente novamente.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Transações - ${investimento.nome}`}
    >
      <div className="space-y-4">
        {/* Header com botão de adicionar */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">
              Histórico de Transações
            </h3>
            <p className="text-sm text-gray-500">
              {transacoes.length} transação(ões) encontrada(s)
            </p>
          </div>
          <Button
            onClick={onAddTransacao}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Lista de transações */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando transações...</p>
          </div>
        ) : transacoes.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTipoIcon(transacao.tipo)}
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getTipoColor(transacao.tipo)}
                        >
                          {getTipoLabel(transacao.tipo)}
                        </Badge>
                        <span className="font-medium text-gray-900">
                          {formatarMoeda(transacao.valor, investimento.moeda)}
                        </span>
                      </div>
                      {transacao.descricao && (
                        <p className="text-sm text-gray-500 mt-1">
                          {transacao.descricao}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(transacao.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTransacao(transacao)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transacao.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              Nenhuma transação encontrada
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Registre a primeira transação para este investimento
            </p>
            <Button
              onClick={onAddTransacao}
              className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
