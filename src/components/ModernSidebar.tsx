"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  CreditCard,
  Tag,
  RotateCcw,
  Settings,
  Menu,
  LogOut,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral das finanças",
  },
  {
    label: "Transações",
    path: "/transacoes",
    icon: CreditCard,
    description: "Gerenciar transações",
  },
  {
    label: "Categorias",
    path: "/categorias",
    icon: Tag,
    description: "Organizar categorias",
  },
  {
    label: "Contas Recorrentes",
    path: "/contas-recorrentes",
    icon: RotateCcw,
    description: "Contas automáticas",
  },
  {
    label: "Configurações",
    path: "/configuracoes",
    icon: Settings,
    description: "Configurações do sistema",
  },
];

interface ModernSidebarProps {
  children: React.ReactNode;
}

export default function ModernSidebar({ children }: ModernSidebarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-zinc-200/60">
        <Image
          src="/images/jsl-financas.svg"
          alt="JSL Finanças"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 px-4 text-left",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              )}
              onClick={() => {
                router.push(item.path);
                closeMobileMenu();
              }}
            >
              <Icon className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs opacity-70">{item.description}</span>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200/60">
        {session && (
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
            {/* User Info */}
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {session.user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {session.user?.name || session.user?.email}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {session.user?.email}
              </p>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-zinc-200/60 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg"
            onClick={toggleMobileMenu}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-80">
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}
