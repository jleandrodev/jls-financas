import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const contasRecorrentes = await prisma.contaRecorrente.findMany({
      include: {
        categoria: true,
        transacoes: {
          where: {
            data: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              lt: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ),
            },
          },
          orderBy: {
            data: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        diaVencimento: "asc",
      },
    });

    const contasComStatus = contasRecorrentes.map((conta) => {
      const hoje = new Date();
      const diaVencimento = conta.diaVencimento;
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      // Calcular data de vencimento para o mês atual
      const dataVencimento = new Date(anoAtual, mesAtual, diaVencimento);

      // Se o dia de vencimento já passou este mês, considerar próximo mês
      if (dataVencimento < hoje) {
        dataVencimento.setMonth(mesAtual + 1);
      }

      const diasAteVencimento = Math.ceil(
        (dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
      );
      const pagoEsteMes = conta.transacoes.length > 0;
      const dataUltimoPagamento = conta.transacoes[0]?.data;

      return {
        conta: {
          id: conta.id,
          nome: conta.nome,
          valor: Number(conta.valor),
          descricao: conta.descricao,
          diaVencimento: conta.diaVencimento,
          ativo: conta.ativo,
          categoriaId: conta.categoriaId,
          categoria: {
            id: conta.categoria.id,
            nome: conta.categoria.nome,
            tipo: conta.categoria.tipo,
          },
          createdAt: conta.createdAt.toISOString(),
          updatedAt: conta.updatedAt.toISOString(),
        },
        pagoEsteMes,
        dataUltimoPagamento: dataUltimoPagamento?.toISOString(),
        diasAteVencimento,
      };
    });

    return NextResponse.json(contasComStatus);
  } catch (error) {
    console.error("Erro ao buscar contas recorrentes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, valor, descricao, diaVencimento, categoriaId } = body;

    if (!nome || !valor || !diaVencimento || !categoriaId) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios: nome, valor, diaVencimento, categoriaId",
        },
        { status: 400 }
      );
    }

    if (diaVencimento < 1 || diaVencimento > 31) {
      return NextResponse.json(
        { error: "Dia de vencimento deve estar entre 1 e 31" },
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

    const contaRecorrente = await prisma.contaRecorrente.create({
      data: {
        nome,
        valor,
        descricao,
        diaVencimento,
        categoriaId,
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
    console.error("Erro ao criar conta recorrente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
