import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carteiraId = searchParams.get("carteiraId");

    const where = carteiraId ? { carteiraId } : {};

    const investimentos = await prisma.investimento.findMany({
      where,
      include: {
        carteira: true,
        transacoes: {
          orderBy: {
            data: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(investimentos);
  } catch (error) {
    console.error("Erro ao buscar investimentos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao, moeda, carteiraId } = await request.json();

    if (!nome || !moeda || !carteiraId) {
      return NextResponse.json(
        { error: "Nome, moeda e carteira são obrigatórios" },
        { status: 400 }
      );
    }

    const investimento = await prisma.investimento.create({
      data: {
        nome,
        descricao: descricao || null,
        moeda,
        carteiraId,
      },
    });

    return NextResponse.json(investimento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar investimento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
