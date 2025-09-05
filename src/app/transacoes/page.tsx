"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import TransacaoModal from "@/components/TransacaoModal";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useCategorias } from "@/hooks/useCategorias";

export default function TransacoesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showTransacaoModal, setShowTransacaoModal] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState<{
    id: string;
    valor: number;
    descricao: string;
    data: string;
    categoriaId: string;
  } | null>(null);
  const [filtros, setFiltros] = useState({
    categoriaId: "",
    dataInicio: "",
    dataFim: "",
  });

  const {
    transacoes,
    loading,
    error,
    createTransacao,
    updateTransacao,
    deleteTransacao,
  } = useTransacoes(filtros);

  const {
    categorias,
    loading: categoriasLoading,
    createCategoria,
  } = useCategorias();

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleTransacaoSave = async (novaTransacao: {
    valor: number;
    descricao: string;
    data: string;
    categoriaId: string;
    contaRecorrenteId?: string;
    isParcelada?: boolean;
    numeroParcelas?: number;
  }) => {
    try {
      if (editingTransacao) {
        await updateTransacao(editingTransacao.id, novaTransacao);
        setEditingTransacao(null);
      } else {
        const resultado = await createTransacao(novaTransacao);

        // Mostrar mensagem se foram criadas parcelas
        if (resultado.transacoes && resultado.transacoes.length > 1) {
          alert(`${resultado.transacoes.length} parcelas criadas com sucesso!`);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    }
  };

  const handleCategoriaSave = async (novaCategoria: {
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  }) => {
    try {
      await createCategoria(novaCategoria);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria. Tente novamente.");
    }
  };

  const handleEdit = (transacao: {
    id: string;
    valor: number;
    descricao: string | null;
    data: string;
    categoriaId: string;
  }) => {
    setEditingTransacao({
      id: transacao.id,
      valor: transacao.valor,
      descricao: transacao.descricao || "",
      data: transacao.data,
      categoriaId: transacao.categoriaId,
    });
    setShowTransacaoModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await deleteTransacao(id);
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        alert("Erro ao deletar transação. Tente novamente.");
      }
    }
  };

  const handleModalClose = () => {
    setShowTransacaoModal(false);
    setEditingTransacao(null);
  };

  const calcularSaldo = () => {
    return transacoes.reduce((total, transacao) => {
      const valor = Number(transacao.valor) || 0;
      return transacao.categoria.tipo === "ENTRADA"
        ? total + valor
        : total - valor;
    }, 0);
  };

  const saldo = calcularSaldo();

  // Garantir que o saldo seja sempre um número válido
  const saldoValido = isNaN(saldo) ? 0 : saldo;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Transações
            </h1>
            <button
              onClick={() => setShowTransacaoModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
            >
              Nova Transação
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={filtros.categoriaId}
                  onChange={(e) =>
                    setFiltros({ ...filtros, categoriaId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome} (
                      {categoria.tipo === "ENTRADA" ? "Entrada" : "Saída"})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataInicio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataFim: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Saldo atual */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Saldo Atual
            </h2>
            <div
              className={`text-2xl sm:text-3xl font-bold ${
                saldoValido >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              R${" "}
              {saldoValido.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Lista de transações */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Histórico de Transações
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {transacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          transacao.categoria.tipo === "ENTRADA"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            transacao.categoria.tipo === "ENTRADA"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transacao.categoria.tipo === "ENTRADA" ? "+" : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {transacao.descricao || "Sem descrição"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {transacao.categoria.nome}
                        {transacao.contaRecorrente && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {transacao.contaRecorrente.nome}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {new Date(
                          transacao.data + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          transacao.categoria.tipo === "ENTRADA"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transacao.categoria.tipo === "ENTRADA" ? "+" : "-"}R${" "}
                        {transacao.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {transacao.categoria.tipo === "ENTRADA"
                          ? "Entrada"
                          : "Saída"}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(transacao)}
                        className="text-blue-400 hover:text-blue-600 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(transacao.id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {transacoes.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhuma transação encontrada
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Crie sua primeira transação para começar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <TransacaoModal
        isOpen={showTransacaoModal}
        onClose={handleModalClose}
        onSave={handleTransacaoSave}
        categorias={categorias}
        onCategoriaSave={handleCategoriaSave}
        initialData={editingTransacao}
      />
    </div>
  );
}
