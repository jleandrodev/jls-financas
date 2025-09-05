import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - Atualizar transação
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { valor, descricao, data, categoriaId, contaRecorrenteId } =
      await request.json();
    const { id } = await params;

    if (!valor || !categoriaId) {
      return NextResponse.json(
        { error: "Valor e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a categoria existe
    const categoria = await prisma.categoria.findFirst({
      where: {
        id: categoriaId,
      },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );
    }

    // Se contaRecorrenteId foi fornecido, verificar se existe
    if (contaRecorrenteId) {
      const contaRecorrente = await prisma.contaRecorrente.findFirst({
        where: {
          id: contaRecorrenteId,
        },
      });

      if (!contaRecorrente) {
        return NextResponse.json(
          { error: "Conta recorrente não encontrada" },
          { status: 404 }
        );
      }
    }

    const transacao = await prisma.transacao.updateMany({
      where: {
        id: id,
      },
      data: {
        valor: parseFloat(valor),
        descricao: descricao || null,
        data: data ? new Date(data + "T00:00:00") : new Date(), // Adicionar horário para evitar problemas de timezone
        categoriaId,
        contaRecorrenteId: contaRecorrenteId || null,
      },
    });

    if (transacao.count === 0) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    const transacaoAtualizada = await prisma.transacao.findUnique({
      where: { id: id },
      include: {
        categoria: true,
        contaRecorrente: true,
      },
    });

    // Formatar a data para o frontend
    const transacaoFormatada = {
      ...transacaoAtualizada,
      data: transacaoAtualizada?.data.toISOString().split("T")[0], // Formatar para YYYY-MM-DD
    };

    return NextResponse.json(transacaoFormatada);
  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar transação
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const transacao = await prisma.transacao.deleteMany({
      where: {
        id: id,
      },
    });

    if (transacao.count === 0) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transação excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
