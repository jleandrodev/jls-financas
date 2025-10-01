"use client";

import { useContasRecorrentes } from "@/hooks/useContasRecorrentes";
import { useRouter } from "next/navigation";

export default function ContasRecorrentesCard() {
  const { contasRecorrentes, loading } = useContasRecorrentes();
  const router = useRouter();

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
    if (pagoEsteMes) return "Pago";
    if (diasAteVencimento <= 0) return "Vencido";
    if (diasAteVencimento === 1) return "Amanhã";
    if (diasAteVencimento <= 7) return `${diasAteVencimento}d`;
    return `${diasAteVencimento}d`;
  };

  // Filtrar apenas contas ativas e limitar a 5 para o dashboard
  const contasAtivas = contasRecorrentes
    .filter(({ conta }) => conta.ativo)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border border-zinc-200/60">
        <div className="px-6 py-4 border-b border-zinc-200/60">
          <h2 className="text-lg font-medium text-gray-900">
            Contas Recorrentes
          </h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border border-zinc-200/60">
      <div className="px-6 py-4 border-b border-zinc-200/60 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Contas Recorrentes
        </h2>
        <button
          onClick={() => router.push("/contas-recorrentes")}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          Ver todas
        </button>
      </div>

      {contasAtivas.length === 0 ? (
        <div className="p-6 text-center">
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
            Cadastre suas contas recorrentes para acompanhar os pagamentos.
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push("/contas-recorrentes")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cadastrar Conta
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-zinc-200/60">
          {contasAtivas.map(({ conta, pagoEsteMes, diasAteVencimento }) => (
            <div key={conta.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conta.nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        {conta.categoria.nome} • Dia {conta.diaVencimento}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          pagoEsteMes,
                          diasAteVencimento
                        )}`}
                      >
                        {getStatusText(pagoEsteMes, diasAteVencimento)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(conta.valor)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
