"use client";

import { useState } from "react";
import { useContasRecorrentes } from "@/hooks/useContasRecorrentes";
import { ContaRecorrente } from "@/types/contas-recorrentes";
import ContaRecorrenteModal from "@/components/ContaRecorrenteModal";
import ModernLayout from "@/components/ModernLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RotateCcw,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

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
      <ModernLayout>
        <div className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-zinc-600">
              Carregando contas recorrentes...
            </p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Contas Recorrentes
            </h1>
            <p className="text-zinc-600 mt-1">
              Gerencie suas contas que se repetem mensalmente
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Conta Recorrente
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {contasRecorrentes.length === 0 ? (
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">
                Nenhuma conta recorrente
              </h3>
              <p className="text-zinc-500 mt-1">
                Comece criando uma nova conta recorrente.
              </p>
              <div className="mt-6">
                <Button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Conta Recorrente
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Gasto Fixo Mensal */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600">
                    Gasto Fixo Mensal
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-zinc-900">
                    {formatCurrency(
                      contasRecorrentes
                        .filter(({ conta }) => conta.ativo)
                        .reduce((total, { conta }) => total + conta.valor, 0)
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Total das contas ativas
                  </p>
                </CardContent>
              </Card>

              {/* Já Pago Este Mês */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600">
                    Já Pago Este Mês
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      contasRecorrentes
                        .filter(
                          ({ conta, pagoEsteMes }) => conta.ativo && pagoEsteMes
                        )
                        .reduce((total, { conta }) => total + conta.valor, 0)
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Contas pagas este mês
                  </p>
                </CardContent>
              </Card>

              {/* Falta Pagar */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-yellow-50 to-amber-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600">
                    Falta Pagar
                  </CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(
                      contasRecorrentes
                        .filter(
                          ({ conta, pagoEsteMes }) =>
                            conta.ativo && !pagoEsteMes
                        )
                        .reduce((total, { conta }) => total + conta.valor, 0)
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Pendente de pagamento
                  </p>
                </CardContent>
              </Card>

              {/* Contas Atrasadas */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-red-50 to-rose-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600">
                    Contas Atrasadas
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {
                      contasRecorrentes.filter(
                        ({ conta, pagoEsteMes, diasAteVencimento }) =>
                          conta.ativo && !pagoEsteMes && diasAteVencimento <= 0
                      ).length
                    }
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Contas vencidas</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Contas Recorrentes */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-zinc-600" />
                  Lista de Contas Recorrentes
                </CardTitle>
                <CardDescription>
                  Gerencie suas contas que se repetem mensalmente
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100">
                  {contasRecorrentes.map(
                    ({ conta, pagoEsteMes, diasAteVencimento }) => (
                      <div
                        key={conta.id}
                        className={`p-4 sm:p-6 hover:bg-zinc-50 transition-colors ${
                          !conta.ativo ? "opacity-60" : ""
                        }`}
                      >
                        {/* Mobile Layout */}
                        <div className="block sm:hidden">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                pagoEsteMes
                                  ? "bg-green-100"
                                  : diasAteVencimento <= 0
                                  ? "bg-red-100"
                                  : diasAteVencimento <= 7
                                  ? "bg-yellow-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {pagoEsteMes ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : diasAteVencimento <= 0 ? (
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                              ) : (
                                <Clock className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-zinc-900 truncate">
                                {conta.nome}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {conta.categoria.nome}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Dia {conta.diaVencimento}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    conta.ativo
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {conta.ativo ? "Ativa" : "Inativa"}
                                </Badge>
                              </div>
                              <div className="mt-2">
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getStatusColor(
                                    pagoEsteMes,
                                    diasAteVencimento
                                  )}`}
                                >
                                  {getStatusText(
                                    pagoEsteMes,
                                    diasAteVencimento
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-zinc-900">
                              {formatCurrency(conta.valor)}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleAtiva(conta.id, conta.ativo)
                                }
                                className="h-8 w-8 p-0 text-zinc-600 hover:text-zinc-700 hover:bg-zinc-50"
                              >
                                {conta.ativo ? (
                                  <ToggleRight className="w-4 h-4" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(conta)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(conta.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                pagoEsteMes
                                  ? "bg-green-100"
                                  : diasAteVencimento <= 0
                                  ? "bg-red-100"
                                  : diasAteVencimento <= 7
                                  ? "bg-yellow-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {pagoEsteMes ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              ) : diasAteVencimento <= 0 ? (
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                              ) : (
                                <Clock className="w-6 h-6 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-zinc-900">
                                {conta.nome}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {conta.categoria.nome}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Dia {conta.diaVencimento}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${
                                    conta.ativo
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {conta.ativo ? "Ativa" : "Inativa"}
                                </Badge>
                              </div>
                              <div className="mt-2">
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${getStatusColor(
                                    pagoEsteMes,
                                    diasAteVencimento
                                  )}`}
                                >
                                  {getStatusText(
                                    pagoEsteMes,
                                    diasAteVencimento
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-semibold text-zinc-900">
                                {formatCurrency(conta.valor)}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleAtiva(conta.id, conta.ativo)
                                }
                                className="text-zinc-600 hover:text-zinc-700 hover:bg-zinc-50"
                              >
                                {conta.ativo ? (
                                  <ToggleRight className="w-4 h-4" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(conta)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(conta.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ContaRecorrenteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        contaRecorrente={selectedConta}
        mode={modalMode}
      />
    </ModernLayout>
  );
}
