"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModernLayout from "@/components/ModernLayout";
import { useCarteirasInvestimento } from "@/hooks/useCarteirasInvestimento";
import { useTransacoesInvestimento } from "@/hooks/useTransacoesInvestimento";
import { useCotacoes } from "@/hooks/useCotacoes";
import CarteiraModal from "@/components/CarteiraModal";
import InvestimentoModal from "@/components/InvestimentoModal";
import TransacaoInvestimentoModal from "@/components/TransacaoInvestimentoModal";
import TransacoesInvestimentoListModal from "@/components/TransacoesInvestimentoListModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Euro,
  Wallet,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

export default function InvestimentosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCarteiraModal, setShowCarteiraModal] = useState(false);
  const [showInvestimentoModal, setShowInvestimentoModal] = useState(false);
  const [showTransacaoModal, setShowTransacaoModal] = useState(false);
  const [showTransacoesListModal, setShowTransacoesListModal] = useState(false);
  const [selectedCarteira, setSelectedCarteira] = useState<string | null>(null);
  const [selectedInvestimento, setSelectedInvestimento] = useState<
    string | null
  >(null);
  const [editingCarteira, setEditingCarteira] = useState<any>(null);
  const [editingInvestimento, setEditingInvestimento] = useState<any>(null);
  const [editingTransacao, setEditingTransacao] = useState<any>(null);
  const [currentInvestimento, setCurrentInvestimento] = useState<any>(null);

  const {
    carteiras,
    loading,
    error,
    createCarteira,
    updateCarteira,
    deleteCarteira,
    refetch,
  } = useCarteirasInvestimento();

  const { createTransacao, updateTransacao, deleteTransacao } =
    useTransacoesInvestimento();

  const { cotacoes, converterMoeda, formatarMoeda } = useCotacoes();

  // Coletar todos os investimentos de todas as carteiras
  const todosInvestimentos = carteiras.flatMap(
    (carteira) =>
      carteira.investimentos?.map((investimento) => ({
        ...investimento,
        carteira: {
          id: carteira.id,
          nome: carteira.nome,
        },
      })) || []
  );

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

  const handleCarteiraSave = async (carteira: {
    nome: string;
    descricao?: string;
  }) => {
    try {
      if (editingCarteira) {
        await updateCarteira(editingCarteira.id, carteira);
        setEditingCarteira(null);
      } else {
        await createCarteira(carteira);
      }
    } catch (error) {
      console.error("Erro ao salvar carteira:", error);
      alert("Erro ao salvar carteira. Tente novamente.");
    }
  };

  const handleInvestimentoSave = async (investimento: {
    nome: string;
    descricao?: string;
    moeda: "BRL" | "USD" | "EUR";
    carteiraId: string;
  }) => {
    try {
      console.log("Salvando investimento:", investimento);

      if (editingInvestimento) {
        console.log("Atualizando investimento:", editingInvestimento.id);
        const response = await fetch(
          `/api/investimentos/${editingInvestimento.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(investimento),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro na resposta:", response.status, errorText);
          throw new Error("Erro ao atualizar investimento");
        }

        setEditingInvestimento(null);
        await refetch();
      } else {
        console.log("Criando novo investimento");
        const response = await fetch("/api/investimentos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(investimento),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Erro na resposta:", response.status, errorText);
          throw new Error("Erro ao criar investimento");
        }

        await refetch();
      }
    } catch (error) {
      console.error("Erro ao salvar investimento:", error);
      alert("Erro ao salvar investimento. Tente novamente.");
    }
  };

  const handleInvestimentoDelete = async (investimentoId: string) => {
    try {
      if (
        confirm(
          "Tem certeza que deseja excluir este investimento? Todas as transações associadas também serão excluídas."
        )
      ) {
        const response = await fetch(`/api/investimentos/${investimentoId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir investimento");
        }

        await refetch();
      }
    } catch (error) {
      console.error("Erro ao excluir investimento:", error);
      alert("Erro ao excluir investimento. Tente novamente.");
    }
  };

  const handleTransacaoSave = async (transacao: {
    valor: number;
    descricao?: string;
    data: string;
    tipo: "APORTE" | "RESGATE" | "RENDIMENTO";
    investimentoId: string;
  }) => {
    try {
      if (editingTransacao) {
        await updateTransacao(editingTransacao.id, transacao);
        setEditingTransacao(null);
      } else {
        await createTransacao(transacao);
      }
      await refetch();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    }
  };

  const handleTransacaoEdit = (transacao: any) => {
    setEditingTransacao(transacao);
    setShowTransacaoModal(true);
  };

  const handleTransacaoDelete = async (transacaoId: string) => {
    try {
      if (confirm("Tem certeza que deseja excluir esta transação?")) {
        await deleteTransacao(transacaoId);
        await refetch();
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação. Tente novamente.");
    }
  };

  const handleShowTransacoes = (investimento: any) => {
    setCurrentInvestimento(investimento);
    setShowTransacoesListModal(true);
  };

  const calcularTotalCarteira = (carteira: any) => {
    let totalBRL = 0;

    carteira.investimentos?.forEach((investimento: any) => {
      const saldoInvestimento =
        investimento.transacoes?.reduce((total: number, transacao: any) => {
          const valor = Number(transacao.valor) || 0;
          return transacao.tipo === "APORTE" || transacao.tipo === "RENDIMENTO"
            ? total + valor
            : total - valor;
        }, 0) || 0;

      if (investimento.moeda === "BRL") {
        totalBRL += saldoInvestimento;
      } else {
        totalBRL += converterMoeda(saldoInvestimento, investimento.moeda);
      }
    });

    return totalBRL;
  };

  const getMoedaIcon = (moeda: string) => {
    switch (moeda) {
      case "USD":
        return <DollarSign className="w-4 h-4" />;
      case "EUR":
        return <Euro className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getTipoTransacaoIcon = (tipo: string) => {
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

  return (
    <ModernLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden min-h-screen">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold text-zinc-900">
              Investimentos
            </h1>
            <p className="text-zinc-600 mt-1 text-sm sm:text-base">
              Gerencie suas carteiras e investimentos
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              onClick={() => setShowCarteiraModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg w-full sm:w-auto text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Carteira
            </Button>
            <Button
              onClick={() => setShowInvestimentoModal(true)}
              variant="outline"
              className="w-full sm:w-auto text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Investimento
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Cotações */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Cotações Atuais
            </CardTitle>
            <CardDescription>Valores de conversão para reais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">USD:</span>
                <span className="text-lg font-bold">
                  R$ {cotacoes.USD.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium">EUR:</span>
                <span className="text-lg font-bold">
                  R$ {cotacoes.EUR.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Carteiras */}
        {carteiras.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {carteiras.map((carteira) => {
              const totalCarteira = calcularTotalCarteira(carteira);

              return (
                <Card
                  key={carteira.id}
                  className="shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                          <PieChart className="h-5 w-5 text-zinc-600 flex-shrink-0" />
                          <span className="truncate">{carteira.nome}</span>
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {carteira.descricao || "Sem descrição"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCarteira(carteira);
                            setShowCarteiraModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                "Tem certeza que deseja excluir esta carteira?"
                              )
                            ) {
                              deleteCarteira(carteira.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Total da Carteira */}
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-zinc-600">
                            Total da Carteira
                          </p>
                          <p className="text-lg sm:text-2xl font-bold text-zinc-900 break-all">
                            R${" "}
                            {totalCarteira.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${
                            totalCarteira >= 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          } text-xs px-2 py-1 flex-shrink-0`}
                        >
                          {totalCarteira >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {totalCarteira >= 0 ? "Positivo" : "Negativo"}
                        </Badge>
                      </div>
                    </div>

                    {/* Investimentos */}
                    {carteira.investimentos &&
                    carteira.investimentos.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-medium text-zinc-900 text-sm sm:text-base">
                          Investimentos
                        </h4>
                        {carteira.investimentos.map((investimento: any) => {
                          const saldoInvestimento =
                            investimento.transacoes?.reduce(
                              (total: number, transacao: any) => {
                                const valor = Number(transacao.valor) || 0;
                                return transacao.tipo === "APORTE" ||
                                  transacao.tipo === "RENDIMENTO"
                                  ? total + valor
                                  : total - valor;
                              },
                              0
                            ) || 0;

                          const saldoEmBRL =
                            investimento.moeda === "BRL"
                              ? saldoInvestimento
                              : converterMoeda(
                                  saldoInvestimento,
                                  investimento.moeda
                                );

                          return (
                            <div
                              key={investimento.id}
                              className="p-3 sm:p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="flex-shrink-0">
                                    {getMoedaIcon(investimento.moeda)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-zinc-900 text-sm sm:text-base truncate">
                                      {investimento.nome}
                                    </p>
                                    <p className="text-xs sm:text-sm text-zinc-500 truncate">
                                      {investimento.descricao ||
                                        "Sem descrição"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                  <div className="text-left sm:text-right">
                                    <p className="font-semibold text-zinc-900 text-sm sm:text-base break-all">
                                      {formatarMoeda(
                                        saldoInvestimento,
                                        investimento.moeda
                                      )}
                                    </p>
                                    <p className="text-xs sm:text-sm text-zinc-500 break-all">
                                      R${" "}
                                      {saldoEmBRL.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                      })}
                                    </p>
                                  </div>

                                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedInvestimento(
                                          investimento.id
                                        );
                                        setShowTransacaoModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs h-7 px-2"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      <span className="hidden sm:inline">
                                        Transação
                                      </span>
                                      <span className="sm:hidden">+</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleShowTransacoes(investimento)
                                      }
                                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-7 w-7 p-0"
                                    >
                                      <TrendingUp className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setEditingInvestimento(investimento);
                                        setShowInvestimentoModal(true);
                                      }}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50 h-7 w-7 p-0"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleInvestimentoDelete(
                                          investimento.id
                                        )
                                      }
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <PieChart className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-400 mx-auto mb-3 sm:mb-4" />
                        <p className="text-zinc-500 text-xs sm:text-sm">
                          Nenhum investimento cadastrado
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 text-xs sm:text-sm h-8 sm:h-9"
                          onClick={() => {
                            setSelectedCarteira(carteira.id);
                            setShowInvestimentoModal(true);
                          }}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Adicionar Investimento
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="text-center py-8 sm:py-12">
              <PieChart className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-zinc-500 text-base sm:text-lg font-medium">
                Nenhuma carteira encontrada
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-2">
                Crie sua primeira carteira para começar
              </p>
              <Button
                onClick={() => setShowCarteiraModal(true)}
                className="mt-3 sm:mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg text-sm h-9 sm:h-10"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Criar Primeira Carteira
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <CarteiraModal
        isOpen={showCarteiraModal}
        onClose={() => {
          setShowCarteiraModal(false);
          setEditingCarteira(null);
        }}
        onSave={handleCarteiraSave}
        initialData={editingCarteira}
      />

      <InvestimentoModal
        isOpen={showInvestimentoModal}
        onClose={() => {
          setShowInvestimentoModal(false);
          setEditingInvestimento(null);
          setSelectedCarteira(null);
        }}
        onSave={handleInvestimentoSave}
        carteiras={carteiras}
        selectedCarteira={selectedCarteira}
        initialData={editingInvestimento}
      />

      <TransacaoInvestimentoModal
        isOpen={showTransacaoModal}
        onClose={() => {
          setShowTransacaoModal(false);
          setSelectedInvestimento(null);
          setEditingTransacao(null);
        }}
        onSave={handleTransacaoSave}
        investimentos={todosInvestimentos}
        selectedInvestimento={selectedInvestimento}
        initialData={editingTransacao}
      />

      {currentInvestimento && (
        <TransacoesInvestimentoListModal
          isOpen={showTransacoesListModal}
          onClose={() => {
            setShowTransacoesListModal(false);
            setCurrentInvestimento(null);
          }}
          investimento={currentInvestimento}
          onEditTransacao={handleTransacaoEdit}
          onDeleteTransacao={handleTransacaoDelete}
          onAddTransacao={() => {
            setShowTransacoesListModal(false);
            setSelectedInvestimento(currentInvestimento.id);
            setShowTransacaoModal(true);
          }}
        />
      )}
    </ModernLayout>
  );
}
