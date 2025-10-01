"use client";

import { useState } from "react";
import { useUsuarios, Usuario } from "@/hooks/useUsuarios";
import UsuarioModal from "@/components/UsuarioModal";
import ModernLayout from "@/components/ModernLayout";
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
  Settings,
  Users,
  User,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";

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
      <ModernLayout>
        <div className="p-6">
          <div className="text-center">
            <div className="text-lg text-zinc-600">Carregando usuários...</div>
          </div>
        </div>
      </ModernLayout>
    );
  }

  if (error) {
    return (
      <ModernLayout>
        <div className="p-6">
          <div className="text-center">
            <div className="text-lg text-red-600">Erro: {error}</div>
          </div>
        </div>
      </ModernLayout>
    );
  }

  return (
    <ModernLayout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Configurações</h1>
            <p className="text-zinc-600 mt-1">
              Gerencie usuários e configurações do sistema
            </p>
          </div>
        </div>

        {/* Seção de Usuários */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-zinc-600" />
                  Gerenciamento de Usuários
                </CardTitle>
                <CardDescription>
                  Gerencie os usuários do sistema
                </CardDescription>
              </div>
              <Button
                onClick={handleCreateUsuario}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {usuarios.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="p-4 sm:p-6 hover:bg-zinc-50 transition-colors"
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-zinc-900 truncate">
                            {usuario.name}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Mail className="w-3 h-3 mr-1" />
                              {usuario.email}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                usuario.emailConfirmed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {usuario.emailConfirmed ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirmado
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pendente
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex flex-col gap-1 mt-2 text-xs text-zinc-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Criado: {formatDate(usuario.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Último acesso:{" "}
                              {usuario.lastSignIn
                                ? formatDate(usuario.lastSignIn)
                                : "Nunca"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUsuario(usuario)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUsuario(usuario.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-zinc-900">
                            {usuario.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Mail className="w-3 h-3 mr-1" />
                              {usuario.email}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                usuario.emailConfirmed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {usuario.emailConfirmed ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirmado
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pendente
                                </>
                              )}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Criado: {formatDate(usuario.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Último acesso:{" "}
                              {usuario.lastSignIn
                                ? formatDate(usuario.lastSignIn)
                                : "Nunca"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUsuario(usuario)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUsuario(usuario.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-zinc-400" />
                </div>
                <p className="text-zinc-500 text-lg font-medium">
                  Nenhum usuário encontrado
                </p>
                <p className="text-zinc-400 text-sm mt-2">
                  Crie o primeiro usuário para começar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <UsuarioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        usuario={selectedUsuario || undefined}
        onSave={handleSaveUsuario}
      />
    </ModernLayout>
  );
}
