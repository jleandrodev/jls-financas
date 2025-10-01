"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModernLayout from "@/components/ModernLayout";
import TransacaoModal from "@/components/TransacaoModal";
import { useTransacoes } from "@/hooks/useTransacoes";
import { useCategorias } from "@/hooks/useCategorias";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Tag,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

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
      <ModernLayout>
        <div className="p-6">
          <div className="text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </ModernLayout>
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
    <ModernLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Transações</h1>
            <p className="text-zinc-600 mt-1">
              Gerencie suas transações financeiras
            </p>
          </div>
          <Button
            onClick={() => setShowTransacaoModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Saldo atual */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Saldo Atual
            </CardTitle>
            <CardDescription>
              Saldo baseado nas transações filtradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div
                className={`text-4xl font-bold ${
                  saldoValido >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                R${" "}
                {saldoValido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-center">
                {saldoValido >= 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700"
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Positivo
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-700"
                  >
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Negativo
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-zinc-600" />
              Filtros
            </CardTitle>
            <CardDescription>
              Filtre suas transações por categoria e período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Categoria
                </label>
                <select
                  value={filtros.categoriaId}
                  onChange={(e) =>
                    setFiltros({ ...filtros, categoriaId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Data Início
                </label>
                <Input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Data Fim
                </label>
                <Input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) =>
                    setFiltros({ ...filtros, dataFim: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de transações */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-600" />
              Histórico de Transações
            </CardTitle>
            <CardDescription>
              Todas as suas transações financeiras
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {transacoes.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {transacoes.map((transacao) => (
                  <div
                    key={transacao.id}
                    className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transacao.categoria.tipo === "ENTRADA"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transacao.categoria.tipo === "ENTRADA" ? (
                          <ArrowUpRight className="w-6 h-6 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-zinc-900">
                          {transacao.descricao || "Sem descrição"}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {transacao.categoria.nome}
                          </Badge>
                          {transacao.contaRecorrente && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-blue-100 text-blue-700"
                            >
                              {transacao.contaRecorrente.nome}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-zinc-500 mt-1">
                          {new Date(
                            transacao.data + "T00:00:00"
                          ).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`text-lg font-semibold ${
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
                        <div className="text-xs text-zinc-500">
                          {transacao.categoria.tipo === "ENTRADA"
                            ? "Entrada"
                            : "Saída"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(transacao)}
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
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-zinc-500 text-lg font-medium">
                  Nenhuma transação encontrada
                </p>
                <p className="text-zinc-400 text-sm mt-2">
                  Crie sua primeira transação para começar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TransacaoModal
        isOpen={showTransacaoModal}
        onClose={handleModalClose}
        onSave={handleTransacaoSave}
        categorias={categorias}
        onCategoriaSave={handleCategoriaSave}
        initialData={editingTransacao}
      />
    </ModernLayout>
  );
}
