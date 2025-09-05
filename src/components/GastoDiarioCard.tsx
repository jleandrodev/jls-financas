"use client";

import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";

interface GastoDiarioCardProps {
  gastoDiarioPermitido: number;
  diasRestantes: number;
  saldo: number;
}

export default function GastoDiarioCard({
  gastoDiarioPermitido,
  diasRestantes,
  saldo,
}: GastoDiarioCardProps) {
  const hoje = new Date();
  const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  const totalDiasNoMes = ultimoDiaDoMes.getDate();
  const diasPassados = hoje.getDate();
  const progressoMes = (diasPassados / totalDiasNoMes) * 100;

  const getStatusColor = () => {
    if (gastoDiarioPermitido <= 0) return "text-red-600";
    if (gastoDiarioPermitido < 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusIcon = () => {
    if (gastoDiarioPermitido <= 0) return <TrendingDown className="w-5 h-5" />;
    if (gastoDiarioPermitido < 50) return <TrendingUp className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  const getStatusMessage = () => {
    if (gastoDiarioPermitido <= 0) {
      return "Saldo insuficiente para o mês";
    }
    if (gastoDiarioPermitido < 50) {
      return "Gasto diário limitado";
    }
    return "Você pode gastar confortavelmente";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden shadow-lg rounded-lg border border-blue-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Gasto Diário Permitido
            </h3>
          </div>
          <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
        </div>

        <div className="mb-4">
          <div className={`text-3xl font-bold ${getStatusColor()} mb-2`}>
            R${" "}
            {gastoDiarioPermitido.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <p className="text-sm text-gray-600">{getStatusMessage()}</p>
        </div>

        <div className="space-y-3">
          {/* Progresso do mês */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progresso do mês</span>
              <span>
                {diasPassados}/{totalDiasNoMes} dias
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressoMes}%` }}
              ></div>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-gray-500">Dias restantes</div>
                <div className="font-medium text-gray-900">{diasRestantes}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-gray-500">Saldo atual</div>
                <div
                  className={`font-medium ${
                    saldo >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  R${" "}
                  {saldo.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dica */}
        {gastoDiarioPermitido > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              💡 <strong>Dica:</strong> Mantenha seus gastos diários abaixo de
              R${" "}
              {gastoDiarioPermitido.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}{" "}
              para manter o orçamento equilibrado até o final do mês.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
