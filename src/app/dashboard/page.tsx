"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModernLayout from "@/components/ModernLayout";
import GastoDiarioCard from "@/components/GastoDiarioCard";
import GraficoTransacoesDiarias from "@/components/GraficoTransacoesDiarias";
import ContasRecorrentesCard from "@/components/ContasRecorrentesCard";
import MesFiltro from "@/components/MesFiltro";
import { useDashboard } from "@/hooks/useDashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Estado para o filtro de mês
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const { data, loading, error } = useDashboard(mesSelecionado);

  if (status === "loading" || loading) {
    return (
      <ModernLayout>
        <div className="p-6">
          <div className="text-center">
            <p>Carregando dashboard...</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <ModernLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
            <p className="text-zinc-600 mt-1">Visão geral das suas finanças</p>
          </div>
          <MesFiltro
            mesSelecionado={mesSelecionado}
            onMesChange={setMesSelecionado}
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Saldo Atual */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Saldo Atual
              </CardTitle>
              <Wallet className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">
                R${" "}
                {data.saldo.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-center pt-1">
                {data.saldo >= 0 ? (
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
            </CardContent>
          </Card>

          {/* Entradas */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Total de Entradas
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">
                R${" "}
                {data.entradas.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Receitas do período</p>
            </CardContent>
          </Card>

          {/* Saídas */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-red-50 to-rose-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">
                Total de Saídas
              </CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">
                R${" "}
                {data.saidas.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Gastos do período</p>
            </CardContent>
          </Card>

          {/* Gasto Diário Permitido */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  Gasto Diário Permitido
                </CardTitle>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-zinc-400 hover:text-zinc-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        Mantenha seus gastos abaixo desse valor para manter as
                        suas contas equilibradas
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900">
                R${" "}
                {data.gastoDiarioPermitido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {data.diasRestantes} dias restantes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Transações Diárias */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Transações Diárias
            </CardTitle>
            <CardDescription>
              Acompanhe seus gastos e receitas ao longo do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoTransacoesDiarias mesSelecionado={mesSelecionado} />
          </CardContent>
        </Card>

        {/* Contas Recorrentes */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Contas Recorrentes
            </CardTitle>
            <CardDescription>
              Gerencie suas contas que se repetem mensalmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContasRecorrentesCard />
          </CardContent>
        </Card>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Gastos por Categoria */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Saídas por Categoria
              </CardTitle>
              <CardDescription>Visualize onde você mais gasta</CardDescription>
            </CardHeader>
            <CardContent>
              {data.transacoesPorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={data.transacoesPorCategoria
                      .sort((a, b) => b.valor - a.valor)
                      .slice(0, 10)}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="categoria"
                      stroke="#666"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      stroke="#666"
                      fontSize={12}
                      tickFormatter={(value) =>
                        `R$ ${value.toLocaleString("pt-BR")}`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`,
                        "Valor",
                      ]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="valor" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-zinc-500">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Entradas vs Saídas por Mês */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Entradas vs Saídas
              </CardTitle>
              <CardDescription>
                Compare receitas e gastos por mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.transacoesPorMes.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.transacoesPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`,
                        "Valor",
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="entradas" fill="#10B981" name="Entradas" />
                    <Bar dataKey="saidas" fill="#EF4444" name="Saídas" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-zinc-500">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Últimas Transações */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-zinc-600" />
              Últimas Transações
            </CardTitle>
            <CardDescription>Suas transações mais recentes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {data.ultimasTransacoes.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {data.ultimasTransacoes.map((transacao) => (
                  <div
                    key={transacao.id}
                    className="p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transacao.categoria.tipo === "ENTRADA"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            transacao.categoria.tipo === "ENTRADA"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transacao.categoria.tipo === "ENTRADA" ? "+" : "-"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">
                          {transacao.descricao || "Sem descrição"}
                        </div>
                        <div className="text-sm text-zinc-500">
                          {transacao.categoria.nome}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {new Date(
                            transacao.data + "T00:00:00"
                          ).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </div>
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-zinc-400" />
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
    </ModernLayout>
  );
}
