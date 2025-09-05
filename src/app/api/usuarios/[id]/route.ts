import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { email, name, password } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email e nome são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const updateData: any = {
      email,
      user_metadata: {
        name,
      },
    };

    // Só atualizar senha se fornecida
    if (password) {
      updateData.password = password;
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      id,
      updateData
    );

    if (error) {
      console.error("Erro ao atualizar usuário:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar usuário: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Usuário atualizado com sucesso",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar usuário
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

    // Não permitir que o usuário delete a si mesmo
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Não é possível excluir seu próprio usuário" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.error("Erro ao deletar usuário:", error);
      return NextResponse.json(
        { error: "Erro ao deletar usuário: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Usuário excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
