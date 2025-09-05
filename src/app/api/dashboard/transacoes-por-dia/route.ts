import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes"); // Formato: YYYY-MM

    if (!mes) {
      return NextResponse.json(
        { error: "Parâmetro 'mes' é obrigatório (formato: YYYY-MM)" },
        { status: 400 }
      );
    }

    // Criar datas de início e fim do mês
    const [ano, mesNumero] = mes.split("-").map(Number);
    const dataInicio = new Date(ano, mesNumero - 1, 1);
    const dataFim = new Date(ano, mesNumero, 0, 23, 59, 59);

    // Buscar transações do mês específico
    const transacoes = await prisma.transacao.findMany({
      where: {
        data: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        categoria: true,
      },
    });

    // Agrupar por dia
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

    // Preencher dias sem transações com zeros
    const diasNoMes = dataFim.getDate();
    const transacoesPorDiaCompletas = [];

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataCompleta = new Date(ano, mesNumero - 1, dia);
      const diaString = dataCompleta.toISOString().substring(0, 10);

      transacoesPorDiaCompletas.push({
        dia: diaString,
        entradas: transacoesPorDia[diaString]?.entradas || 0,
        saidas: transacoesPorDia[diaString]?.saidas || 0,
      });
    }

    return NextResponse.json(transacoesPorDiaCompletas);
  } catch (error) {
    console.error("Erro ao buscar transações por dia:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
