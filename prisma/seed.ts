import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar categorias de exemplo
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nome: "Salário",
        tipo: "ENTRADA",
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Alimentação",
        tipo: "SAIDA",
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Transporte",
        tipo: "SAIDA",
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Lazer",
        tipo: "SAIDA",
      },
    }),
    prisma.categoria.create({
      data: {
        nome: "Freelance",
        tipo: "ENTRADA",
      },
    }),
  ]);

  console.log("✅ Categorias criadas:", categorias.length);

  // Criar transações de exemplo
  const transacoes = await Promise.all([
    prisma.transacao.create({
      data: {
        valor: 5000.0,
        descricao: "Salário mensal",
        data: new Date("2024-01-01"),
        categoriaId: categorias[0].id,
      },
    }),
    prisma.transacao.create({
      data: {
        valor: 800.0,
        descricao: "Supermercado",
        data: new Date("2024-01-02"),
        categoriaId: categorias[1].id,
      },
    }),
    prisma.transacao.create({
      data: {
        valor: 200.0,
        descricao: "Uber",
        data: new Date("2024-01-03"),
        categoriaId: categorias[2].id,
      },
    }),
    prisma.transacao.create({
      data: {
        valor: 150.0,
        descricao: "Cinema",
        data: new Date("2024-01-04"),
        categoriaId: categorias[3].id,
      },
    }),
    prisma.transacao.create({
      data: {
        valor: 1200.0,
        descricao: "Projeto freelance",
        data: new Date("2024-01-05"),
        categoriaId: categorias[4].id,
      },
    }),
  ]);

  console.log("✅ Transações criadas:", transacoes.length);

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
