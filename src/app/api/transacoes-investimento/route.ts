import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const investimentoId = searchParams.get("investimentoId");

    const where = investimentoId ? { investimentoId } : {};

    const transacoes = await prisma.transacaoInvestimento.findMany({
      where,
      include: {
        investimento: {
          include: {
            carteira: true,
          },
        },
      },
      orderBy: {
        data: "desc",
      },
    });

    return NextResponse.json(transacoes);
  } catch (error) {
    console.error("Erro ao buscar transações de investimento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { valor, descricao, data, tipo, investimentoId } =
      await request.json();

    if (!valor || !tipo || !investimentoId) {
      return NextResponse.json(
        { error: "Valor, tipo e investimento são obrigatórios" },
        { status: 400 }
      );
    }

    const transacao = await prisma.transacaoInvestimento.create({
      data: {
        valor,
        descricao: descricao || null,
        data: data ? new Date(data) : new Date(),
        tipo,
        investimentoId,
      },
    });

    return NextResponse.json(transacao, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar transação de investimento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
