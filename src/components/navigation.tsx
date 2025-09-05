"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Navigation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Transações", path: "/transacoes" },
    { label: "Categorias", path: "/categorias" },
    { label: "Contas Recorrentes", path: "/contas-recorrentes" },
    { label: "Configurações", path: "/configuracoes" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/jsl-financas.svg"
              alt="JSL Finanças"
              width={363}
              height={68}
              className="h-8 sm:h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          {status === "loading" ? (
            <div className="hidden md:flex items-center">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : session ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Olá, {session.user?.email}
                </span>
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                  aria-label="Menu"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Entrar
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && session && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
              <div className="px-3 py-2 text-sm text-gray-700 border-b">
                Olá, {session.user?.email}
              </div>
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    closeMobileMenu();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  handleSignOut();
                  closeMobileMenu();
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
