import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const investimento = await prisma.investimento.findUnique({
      where: { id },
      include: {
        carteira: true,
        transacoes: {
          orderBy: {
            data: "desc",
          },
        },
      },
    });

    if (!investimento) {
      return NextResponse.json(
        { error: "Investimento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(investimento);
  } catch (error) {
    console.error("Erro ao buscar investimento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { nome, descricao, moeda, ativo } = await request.json();

    const investimento = await prisma.investimento.update({
      where: { id },
      data: {
        nome,
        descricao: descricao || null,
        moeda,
        ativo: ativo !== undefined ? ativo : true,
      },
    });

    return NextResponse.json(investimento);
  } catch (error) {
    console.error("Erro ao atualizar investimento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.investimento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Investimento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir investimento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
