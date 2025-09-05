"use client";

import { useState } from "react";
import { useUsuarios, Usuario } from "@/hooks/useUsuarios";
import UsuarioModal from "@/components/UsuarioModal";

export default function ConfiguracoesPage() {
  const {
    usuarios,
    loading,
    error,
    createUsuario,
    updateUsuario,
    deleteUsuario,
  } = useUsuarios();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreateUsuario = () => {
    setModalMode("create");
    setSelectedUsuario(null);
    setModalOpen(true);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setModalMode("edit");
    setSelectedUsuario(usuario);
    setModalOpen(true);
  };

  const handleDeleteUsuario = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUsuario(id);
      } catch (error) {
        alert("Erro ao excluir usuário: " + (error as Error).message);
      }
    }
  };

  const handleSaveUsuario = async (data: any) => {
    try {
      if (modalMode === "create") {
        await createUsuario(data);
      } else if (selectedUsuario) {
        await updateUsuario(selectedUsuario.id, data);
      }
    } catch (error) {
      throw error; // Re-throw para o modal tratar
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-lg text-gray-600">Carregando usuários...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-lg text-red-600">Erro: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Configurações
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie usuários e configurações do sistema
          </p>
        </div>

        {/* Seção de Usuários */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Gerenciamento de Usuários
              </h2>
              <button
                onClick={handleCreateUsuario}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto"
              >
                Novo Usuário
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.name}
                      </div>
                      <div className="sm:hidden text-xs text-gray-500">
                        {usuario.email}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {usuario.email}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(usuario.createdAt)}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {usuario.lastSignIn
                          ? formatDate(usuario.lastSignIn)
                          : "Nunca"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          usuario.emailConfirmed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {usuario.emailConfirmed ? "Confirmado" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUsuario(usuario)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteUsuario(usuario.id)}
                          className="text-red-600 hover:text-red-900 text-xs sm:text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {usuarios.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">Nenhum usuário encontrado</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <UsuarioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        usuario={selectedUsuario || undefined}
        onSave={handleSaveUsuario}
      />
    </div>
  );
}
