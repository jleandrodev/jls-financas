"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import GastoDiarioCard from "@/components/GastoDiarioCard";
import GraficoTransacoesDiarias from "@/components/GraficoTransacoesDiarias";
import ContasRecorrentesCard from "@/components/ContasRecorrentesCard";
import { useDashboard } from "@/hooks/useDashboard";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
  const { data, loading, error } = useDashboard();

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            Dashboard
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Saldo Atual */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Saldo Atual
                  </dt>
                  <dd
                    className={`text-lg font-medium ${
                      data.saldo >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    R${" "}
                    {data.saldo.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </dd>
                </dl>
              </div>
            </div>

            {/* Entradas */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Entradas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R${" "}
                    {data.entradas.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </dd>
                </dl>
              </div>
            </div>

            {/* Saídas */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Saídas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R${" "}
                    {data.saidas.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Card de Gasto Diário Permitido */}
          <div className="mb-8">
            <GastoDiarioCard
              gastoDiarioPermitido={data.gastoDiarioPermitido}
              diasRestantes={data.diasRestantes}
              saldo={data.saldo}
            />
          </div>

          {/* Gráfico de Transações Diárias */}
          <div className="mb-8">
            <GraficoTransacoesDiarias />
          </div>

          {/* Contas Recorrentes */}
          <div className="mb-8">
            <ContasRecorrentesCard />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Gráfico de Pizza - Gastos por Categoria */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Gastos por Categoria
              </h2>
              {data.transacoesPorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.transacoesPorCategoria}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, percent }) =>
                        `${categoria} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {data.transacoesPorCategoria.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `R$ ${value.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`,
                        "Valor",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  Nenhum dado disponível
                </div>
              )}
            </div>

            {/* Gráfico de Barras - Entradas vs Saídas por Mês */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Entradas vs Saídas por Mês
              </h2>
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
                <div className="flex items-center justify-center h-48 text-gray-500">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </div>

          {/* Últimas Transações */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Últimas Transações
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {data.ultimasTransacoes.map((transacao) => (
                <div
                  key={transacao.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transacao.descricao || "Sem descrição"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transacao.categoria.nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(
                          transacao.data + "T00:00:00"
                        ).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>

            {data.ultimasTransacoes.length === 0 && (
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
    </div>
  );
}
