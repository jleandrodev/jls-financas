"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import CategoriaModal from "@/components/CategoriaModal";
import { useCategorias } from "@/hooks/useCategorias";

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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Categorias
            </h1>
            <button
              onClick={() => setShowCategoriaModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
            >
              Nova Categoria
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Grid de categorias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categorias.map((categoria) => (
              <div
                key={categoria.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                            categoria.tipo === "ENTRADA"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              categoria.tipo === "ENTRADA"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {categoria.tipo === "ENTRADA" ? "+" : "-"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {categoria.nome}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {categoria.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(categoria)}
                        className="text-blue-400 hover:text-blue-600 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(categoria.id)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categorias.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhuma categoria encontrada
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Crie sua primeira categoria para começar
              </p>
            </div>
          )}
        </div>
      </div>

      <CategoriaModal
        isOpen={showCategoriaModal}
        onClose={handleModalClose}
        onSave={handleCategoriaSave}
        initialData={editingCategoria}
      />
    </div>
  );
}
