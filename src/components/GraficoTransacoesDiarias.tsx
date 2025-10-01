"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { useTransacoesPorDia } from "@/hooks/useTransacoesPorDia";

interface GraficoTransacoesDiariasProps {
  mesSelecionado?: string;
}

export default function GraficoTransacoesDiarias({
  mesSelecionado,
}: GraficoTransacoesDiariasProps) {
  const [mesInterno, setMesInterno] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Usar o mês passado como prop ou o mês interno
  const mesAtual = mesSelecionado || mesInterno;
  const { data, loading, error } = useTransacoesPorDia(mesAtual);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getDate()}/${data.getMonth() + 1}`;
  };

  const formatarTooltip = (value: number, name: string) => {
    const nome = name === "entradas" ? "Entradas" : "Saídas";
    return [
      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      nome,
    ];
  };

  const calcularTotais = () => {
    const totalEntradas = data.reduce((acc, item) => acc + item.entradas, 0);
    const totalSaidas = data.reduce((acc, item) => acc + item.saidas, 0);
    return { totalEntradas, totalSaidas };
  };

  const { totalEntradas, totalSaidas } = calcularTotais();

  const gerarOpcoesMes = () => {
    const opcoes = [];
    const hoje = new Date();

    // Gerar opções para os últimos 12 meses
    for (let i = 0; i < 12; i++) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const valor = `${data.getFullYear()}-${String(
        data.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = data.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
      });
      opcoes.push({ valor, label });
    }

    return opcoes;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-red-500">
          <p>Erro ao carregar dados: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">
            Transações Diárias
          </h2>
        </div>

        {!mesSelecionado && (
          <div className="flex items-center space-x-4">
            <select
              value={mesInterno}
              onChange={(e) => setMesInterno(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {gerarOpcoesMes().map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Totais do mês */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-sm text-green-600 font-medium">
              Total de Entradas
            </div>
            <div className="text-lg font-bold text-green-700">
              R${" "}
              {totalEntradas.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
          <TrendingDown className="w-5 h-5 text-red-600" />
          <div>
            <div className="text-sm text-red-600 font-medium">
              Total de Saídas
            </div>
            <div className="text-lg font-bold text-red-700">
              R${" "}
              {totalSaidas.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="dia"
              tickFormatter={formatarData}
              stroke="#666"
              fontSize={12}
            />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`}
            />
            <Tooltip
              formatter={formatarTooltip}
              labelFormatter={(label) => `Dia: ${formatarData(label)}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="entradas"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              name="Entradas"
            />
            <Line
              type="monotone"
              dataKey="saidas"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2 }}
              name="Saídas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Informações adicionais */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>
          Mostrando dados de{" "}
          {new Date(mesAtual + "-01").toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
          })}
        </p>
        <p className="mt-1">{data.length} dias com transações registradas</p>
      </div>
    </div>
  );
}
