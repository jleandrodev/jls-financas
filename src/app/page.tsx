"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <Image
            src="/images/jsl-financas.svg"
            alt="JSL Finanças"
            width={363}
            height={68}
            className="h-16 sm:h-20 w-auto mx-auto"
          />
        </div>
        <p className="text-xl text-gray-600 mb-8">
          Gerencie suas finanças de forma simples
        </p>
        <div className="space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
