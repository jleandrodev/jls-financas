"use client";

import { useState } from "react";
import { useContasRecorrentes } from "@/hooks/useContasRecorrentes";
import { ContaRecorrente } from "@/types/contas-recorrentes";
import ContaRecorrenteModal from "@/components/ContaRecorrenteModal";
import Navigation from "@/components/navigation";

export default function ContasRecorrentesPage() {
  const {
    contasRecorrentes,
    loading,
    error,
    createContaRecorrente,
    updateContaRecorrente,
    deleteContaRecorrente,
    toggleContaAtiva,
  } = useContasRecorrentes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedConta, setSelectedConta] = useState<
    ContaRecorrente | undefined
  >();

  const handleCreate = () => {
    setModalMode("create");
    setSelectedConta(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (conta: ContaRecorrente) => {
    setModalMode("edit");
    setSelectedConta(conta);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (modalMode === "create") {
      await createContaRecorrente(data);
    } else if (selectedConta) {
      await updateContaRecorrente(selectedConta.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta conta recorrente?")) {
      try {
        await deleteContaRecorrente(id);
      } catch (error) {
        alert("Erro ao excluir conta recorrente");
      }
    }
  };

  const handleToggleAtiva = async (id: string, ativo: boolean) => {
    try {
      await toggleContaAtiva(id, !ativo);
    } catch (error) {
      alert("Erro ao alterar status da conta");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (pagoEsteMes: boolean, diasAteVencimento: number) => {
    if (pagoEsteMes) return "text-green-600 bg-green-100";
    if (diasAteVencimento <= 3) return "text-red-600 bg-red-100";
    if (diasAteVencimento <= 7) return "text-yellow-600 bg-yellow-100";
    return "text-blue-600 bg-blue-100";
  };

  const getStatusText = (pagoEsteMes: boolean, diasAteVencimento: number) => {
    if (pagoEsteMes) return "Pago este mês";
    if (diasAteVencimento <= 0) return "Vencido";
    if (diasAteVencimento === 1) return "Vence amanhã";
    if (diasAteVencimento <= 7) return `Vence em ${diasAteVencimento} dias`;
    return `Vence em ${diasAteVencimento} dias`;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Carregando contas recorrentes...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Contas Recorrentes
                </h1>
                <p className="mt-2 text-gray-600">
                  Gerencie suas contas que se repetem mensalmente
                </p>
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
              >
                Nova Conta Recorrente
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {contasRecorrentes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma conta recorrente
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova conta recorrente.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Nova Conta Recorrente
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Gasto Fixo Mensal */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Gasto Fixo Mensal
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(
                          contasRecorrentes
                            .filter(({ conta }) => conta.ativo)
                            .reduce(
                              (total, { conta }) => total + conta.valor,
                              0
                            )
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Já Pago Este Mês */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Já Pago Este Mês
                      </p>
                      <p className="text-2xl font-semibold text-green-600">
                        {formatCurrency(
                          contasRecorrentes
                            .filter(
                              ({ conta, pagoEsteMes }) =>
                                conta.ativo && pagoEsteMes
                            )
                            .reduce(
                              (total, { conta }) => total + conta.valor,
                              0
                            )
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Falta Pagar */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-yellow-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Falta Pagar
                      </p>
                      <p className="text-2xl font-semibold text-yellow-600">
                        {formatCurrency(
                          contasRecorrentes
                            .filter(
                              ({ conta, pagoEsteMes }) =>
                                conta.ativo && !pagoEsteMes
                            )
                            .reduce(
                              (total, { conta }) => total + conta.valor,
                              0
                            )
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contas Atrasadas */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Contas Atrasadas
                      </p>
                      <p className="text-2xl font-semibold text-red-600">
                        {
                          contasRecorrentes.filter(
                            ({ conta, pagoEsteMes, diasAteVencimento }) =>
                              conta.ativo &&
                              !pagoEsteMes &&
                              diasAteVencimento <= 0
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Contas Recorrentes */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Lista de Contas Recorrentes
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {contasRecorrentes.map(
                    ({ conta, pagoEsteMes, diasAteVencimento }) => (
                      <div
                        key={conta.id}
                        className={`px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors ${
                          !conta.ativo ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                                  pagoEsteMes
                                    ? "bg-green-100"
                                    : diasAteVencimento <= 0
                                    ? "bg-red-100"
                                    : diasAteVencimento <= 7
                                    ? "bg-yellow-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <span
                                  className={`text-sm font-bold ${
                                    pagoEsteMes
                                      ? "text-green-600"
                                      : diasAteVencimento <= 0
                                      ? "text-red-600"
                                      : diasAteVencimento <= 7
                                      ? "text-yellow-600"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {pagoEsteMes
                                    ? "✓"
                                    : diasAteVencimento <= 0
                                    ? "!"
                                    : "○"}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {conta.nome}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {conta.categoria.nome} • Dia{" "}
                                    {conta.diaVencimento}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                      pagoEsteMes,
                                      diasAteVencimento
                                    )}`}
                                  >
                                    {getStatusText(
                                      pagoEsteMes,
                                      diasAteVencimento
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleToggleAtiva(conta.id, conta.ativo)
                                    }
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      conta.ativo
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {conta.ativo ? "Ativa" : "Inativa"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(conta.valor)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(conta)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(conta.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ContaRecorrenteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        contaRecorrente={selectedConta}
        mode={modalMode}
      />
    </>
  );
}
