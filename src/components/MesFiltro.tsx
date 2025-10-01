"use client";

import { Calendar } from "lucide-react";

interface MesFiltroProps {
  mesSelecionado: string;
  onMesChange: (mes: string) => void;
}

export default function MesFiltro({
  mesSelecionado,
  onMesChange,
}: MesFiltroProps) {
  const gerarOpcoesMes = () => {
    const opcoes = [];
    const hoje = new Date();

    // Adicionar opção "Todo o período"
    opcoes.push({ valor: "todos", label: "Todo o período" });

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

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-5 h-5 text-gray-500" />
      <select
        value={mesSelecionado}
        onChange={(e) => onMesChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        {gerarOpcoesMes().map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.label}
          </option>
        ))}
      </select>
    </div>
  );
}
