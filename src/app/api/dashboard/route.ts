import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar todas as transações
    const transacoes = await prisma.transacao.findMany({
      include: {
        categoria: true,
      },
    });

    // Calcular totais
    const entradas = transacoes
      .filter((t) => t.categoria.tipo === "ENTRADA")
      .reduce((total, t) => total + Number(t.valor), 0);

    const saidas = transacoes
      .filter((t) => t.categoria.tipo === "SAIDA")
      .reduce((total, t) => total + Number(t.valor), 0);

    const saldo = entradas - saidas;

    // Agrupar por categoria para gráfico
    const transacoesPorCategoria = transacoes.reduce((acc, transacao) => {
      const categoria = transacao.categoria.nome;
      const valor = Number(transacao.valor);

      if (!acc[categoria]) {
        acc[categoria] = {
          categoria,
          valor: 0,
          tipo: transacao.categoria.tipo,
        };
      }

      acc[categoria].valor += valor;
      return acc;
    }, {} as Record<string, { categoria: string; valor: number; tipo: string }>);

    // Agrupar por mês para gráfico de linha
    const transacoesPorMes = transacoes.reduce((acc, transacao) => {
      const mes = transacao.data.toISOString().substring(0, 7); // YYYY-MM
      const valor = Number(transacao.valor);

      if (!acc[mes]) {
        acc[mes] = {
          mes,
          entradas: 0,
          saidas: 0,
        };
      }

      if (transacao.categoria.tipo === "ENTRADA") {
        acc[mes].entradas += valor;
      } else {
        acc[mes].saidas += valor;
      }

      return acc;
    }, {} as Record<string, { mes: string; entradas: number; saidas: number }>);

    // Converter para array e ordenar por mês
    const transacoesPorMesArray = Object.values(transacoesPorMes).sort((a, b) =>
      a.mes.localeCompare(b.mes)
    );

    // Agrupar por dia para gráfico de linha diário
    const transacoesPorDia = transacoes.reduce((acc, transacao) => {
      const dia = transacao.data.toISOString().substring(0, 10); // YYYY-MM-DD
      const valor = Number(transacao.valor);

      if (!acc[dia]) {
        acc[dia] = {
          dia,
          entradas: 0,
          saidas: 0,
        };
      }

      if (transacao.categoria.tipo === "ENTRADA") {
        acc[dia].entradas += valor;
      } else {
        acc[dia].saidas += valor;
      }

      return acc;
    }, {} as Record<string, { dia: string; entradas: number; saidas: number }>);

    // Converter para array e ordenar por dia
    const transacoesPorDiaArray = Object.values(transacoesPorDia).sort((a, b) =>
      a.dia.localeCompare(b.dia)
    );

    // Últimas 5 transações
    const ultimasTransacoes = transacoes
      .sort((a, b) => b.data.getTime() - a.data.getTime())
      .slice(0, 5);

    // Calcular gasto diário permitido
    const hoje = new Date();
    const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const diasRestantes = ultimoDiaDoMes.getDate() - hoje.getDate() + 1;
    const gastoDiarioPermitido = diasRestantes > 0 ? saldo / diasRestantes : 0;

    return NextResponse.json({
      saldo,
      entradas,
      saidas,
      gastoDiarioPermitido,
      diasRestantes,
      transacoesPorCategoria: Object.values(transacoesPorCategoria),
      transacoesPorMes: transacoesPorMesArray,
      transacoesPorDia: transacoesPorDiaArray,
      ultimasTransacoes,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
