import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const contaRecorrente = await prisma.contaRecorrente.findFirst({
      where: {
        id: id,
      },
      include: {
        categoria: true,
        transacoes: {
          orderBy: {
            data: "desc",
          },
        },
      },
    });

    if (!contaRecorrente) {
      return NextResponse.json(
        { error: "Conta recorrente não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: contaRecorrente.id,
      nome: contaRecorrente.nome,
      valor: Number(contaRecorrente.valor),
      descricao: contaRecorrente.descricao,
      diaVencimento: contaRecorrente.diaVencimento,
      ativo: contaRecorrente.ativo,
      categoriaId: contaRecorrente.categoriaId,
      categoria: {
        id: contaRecorrente.categoria.id,
        nome: contaRecorrente.categoria.nome,
        tipo: contaRecorrente.categoria.tipo,
      },
      transacoes: contaRecorrente.transacoes.map((transacao) => ({
        id: transacao.id,
        valor: Number(transacao.valor),
        descricao: transacao.descricao,
        data: transacao.data.toISOString(),
        categoriaId: transacao.categoriaId,
        contaRecorrenteId: transacao.contaRecorrenteId,
        createdAt: transacao.createdAt.toISOString(),
        updatedAt: transacao.updatedAt.toISOString(),
      })),
      createdAt: contaRecorrente.createdAt.toISOString(),
      updatedAt: contaRecorrente.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Erro ao buscar conta recorrente:", error);
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
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, valor, descricao, diaVencimento, ativo, categoriaId } = body;
    const { id } = await params;

    // Verificar se a conta recorrente existe
    const contaExistente = await prisma.contaRecorrente.findFirst({
      where: {
        id: id,
      },
    });

    if (!contaExistente) {
      return NextResponse.json(
        { error: "Conta recorrente não encontrada" },
        { status: 404 }
      );
    }

    // Se categoriaId foi fornecido, verificar se existe
    if (categoriaId) {
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
    }

    // Validar dia de vencimento se fornecido
    if (diaVencimento && (diaVencimento < 1 || diaVencimento > 31)) {
      return NextResponse.json(
        { error: "Dia de vencimento deve estar entre 1 e 31" },
        { status: 400 }
      );
    }

    const contaRecorrente = await prisma.contaRecorrente.update({
      where: {
        id: id,
      },
      data: {
        ...(nome && { nome }),
        ...(valor && { valor }),
        ...(descricao !== undefined && { descricao }),
        ...(diaVencimento && { diaVencimento }),
        ...(ativo !== undefined && { ativo }),
        ...(categoriaId && { categoriaId }),
      },
      include: {
        categoria: true,
      },
    });

    return NextResponse.json({
      id: contaRecorrente.id,
      nome: contaRecorrente.nome,
      valor: Number(contaRecorrente.valor),
      descricao: contaRecorrente.descricao,
      diaVencimento: contaRecorrente.diaVencimento,
      ativo: contaRecorrente.ativo,
      categoriaId: contaRecorrente.categoriaId,
      categoria: {
        id: contaRecorrente.categoria.id,
        nome: contaRecorrente.categoria.nome,
        tipo: contaRecorrente.categoria.tipo,
      },
      createdAt: contaRecorrente.createdAt.toISOString(),
      updatedAt: contaRecorrente.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Erro ao atualizar conta recorrente:", error);
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
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se a conta recorrente existe
    const contaExistente = await prisma.contaRecorrente.findFirst({
      where: {
        id: id,
      },
    });

    if (!contaExistente) {
      return NextResponse.json(
        { error: "Conta recorrente não encontrada" },
        { status: 404 }
      );
    }

    await prisma.contaRecorrente.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "Conta recorrente excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir conta recorrente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
