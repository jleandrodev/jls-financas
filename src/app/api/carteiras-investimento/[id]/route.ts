import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const carteira = await prisma.carteiraInvestimento.findUnique({
      where: { id },
      include: {
        investimentos: {
          include: {
            transacoes: true,
          },
        },
      },
    });

    if (!carteira) {
      return NextResponse.json(
        { error: "Carteira não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(carteira);
  } catch (error) {
    console.error("Erro ao buscar carteira:", error);
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
    const { nome, descricao, ativo } = await request.json();

    const carteira = await prisma.carteiraInvestimento.update({
      where: { id },
      data: {
        nome,
        descricao: descricao || null,
        ativo: ativo !== undefined ? ativo : true,
      },
    });

    return NextResponse.json(carteira);
  } catch (error) {
    console.error("Erro ao atualizar carteira:", error);
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
    await prisma.carteiraInvestimento.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Carteira excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir carteira:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
