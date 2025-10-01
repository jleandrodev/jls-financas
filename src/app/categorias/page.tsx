"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ModernLayout from "@/components/ModernLayout";
import CategoriaModal from "@/components/CategoriaModal";
import { useCategorias } from "@/hooks/useCategorias";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Tag,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function CategoriasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<{
    id: string;
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  } | null>(null);

  const {
    categorias,
    loading,
    error,
    createCategoria,
    updateCategoria,
    deleteCategoria,
  } = useCategorias();

  if (status === "loading" || loading) {
    return (
      <ModernLayout>
        <div className="p-6">
          <div className="text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleCategoriaSave = async (novaCategoria: {
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  }) => {
    try {
      if (editingCategoria) {
        await updateCategoria(editingCategoria.id, novaCategoria);
        setEditingCategoria(null);
      } else {
        await createCategoria(novaCategoria);
      }
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Erro ao salvar categoria. Tente novamente.");
    }
  };

  const handleEdit = (categoria: {
    id: string;
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  }) => {
    setEditingCategoria(categoria);
    setShowCategoriaModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await deleteCategoria(id);
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        alert("Erro ao deletar categoria. Tente novamente.");
      }
    }
  };

  const handleModalClose = () => {
    setShowCategoriaModal(false);
    setEditingCategoria(null);
  };

  return (
    <ModernLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Categorias</h1>
            <p className="text-zinc-600 mt-1">
              Organize suas transações por categorias
            </p>
          </div>
          <Button
            onClick={() => setShowCategoriaModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Grid de categorias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((categoria) => (
            <Card
              key={categoria.id}
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        categoria.tipo === "ENTRADA"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {categoria.tipo === "ENTRADA" ? (
                        <ArrowUpRight className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900">
                        {categoria.nome}
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          categoria.tipo === "ENTRADA"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {categoria.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(categoria)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(categoria.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categorias.length === 0 && !loading && (
          <Card className="shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-zinc-500 text-lg font-medium">
                Nenhuma categoria encontrada
              </p>
              <p className="text-zinc-400 text-sm mt-2">
                Crie sua primeira categoria para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <CategoriaModal
        isOpen={showCategoriaModal}
        onClose={handleModalClose}
        onSave={handleCategoriaSave}
        initialData={editingCategoria}
      />
    </ModernLayout>
  );
}
