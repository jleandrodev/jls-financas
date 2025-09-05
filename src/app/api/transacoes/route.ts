import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Listar transações do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get("categoriaId");
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");

    const where: any = {};

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) {
        where.data.gte = new Date(dataInicio);
      }
      if (dataFim) {
        where.data.lte = new Date(dataFim);
      }
    }

    const transacoes = await prisma.transacao.findMany({
      where,
      include: {
        categoria: true,
        contaRecorrente: true,
      },
      orderBy: {
        data: "desc",
      },
    });

    // Garantir que os valores sejam números válidos e formatar datas
    const transacoesComValoresValidos = transacoes.map((transacao) => ({
      ...transacao,
      valor: Number(transacao.valor) || 0,
      data: transacao.data.toISOString().split("T")[0], // Formatar para YYYY-MM-DD
    }));

    return NextResponse.json(transacoesComValoresValidos);
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar nova transação
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const {
      valor,
      descricao,
      data,
      categoriaId,
      contaRecorrenteId,
      isParcelada,
      numeroParcelas,
    } = await request.json();

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

    // Se for transação parcelada, criar múltiplas transações
    if (isParcelada && numeroParcelas && numeroParcelas > 1) {
      const valorParcela = parseFloat(valor) / numeroParcelas;
      const dataBase = data ? new Date(data + "T00:00:00") : new Date();
      const transacoes = [];

      for (let i = 0; i < numeroParcelas; i++) {
        const dataParcela = new Date(dataBase);
        dataParcela.setMonth(dataParcela.getMonth() + i);

        const descricaoParcela = `${descricao || "Transação"} (${
          i + 1
        }/${numeroParcelas})`;

        const transacao = await prisma.transacao.create({
          data: {
            valor: valorParcela,
            descricao: descricaoParcela,
            data: dataParcela,
            categoriaId,
            contaRecorrenteId: contaRecorrenteId || null,
          },
          include: {
            categoria: true,
            contaRecorrente: true,
          },
        });

        transacoes.push({
          ...transacao,
          data: transacao.data.toISOString().split("T")[0],
        });
      }

      return NextResponse.json(
        {
          message: `${numeroParcelas} parcelas criadas com sucesso`,
          transacoes,
        },
        { status: 201 }
      );
    } else {
      // Transação única
      const transacao = await prisma.transacao.create({
        data: {
          valor: parseFloat(valor),
          descricao: descricao || null,
          data: data ? new Date(data + "T00:00:00") : new Date(),
          categoriaId,
          contaRecorrenteId: contaRecorrenteId || null,
        },
        include: {
          categoria: true,
          contaRecorrente: true,
        },
      });

      // Formatar a data para o frontend
      const transacaoFormatada = {
        ...transacao,
        data: transacao.data.toISOString().split("T")[0],
      };

      return NextResponse.json(transacaoFormatada, { status: 201 });
    }
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
