import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const carteiras = await prisma.carteiraInvestimento.findMany({
      include: {
        investimentos: {
          include: {
            transacoes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(carteiras);
  } catch (error) {
    console.error("Erro ao buscar carteiras:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao } = await request.json();

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const carteira = await prisma.carteiraInvestimento.create({
      data: {
        nome,
        descricao: descricao || null,
      },
    });

    return NextResponse.json(carteira, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar carteira:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
