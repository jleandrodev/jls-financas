export interface CarteiraInvestimento {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  investimentos?: Investimento[];
}

export interface Investimento {
  id: string;
  nome: string;
  descricao?: string;
  moeda: "BRL" | "USD" | "EUR";
  ativo: boolean;
  carteiraId: string;
  createdAt: string;
  updatedAt: string;
  carteira?: {
    id: string;
    nome: string;
  };
  transacoes?: TransacaoInvestimento[];
}

export interface TransacaoInvestimento {
  id: string;
  valor: number;
  descricao?: string;
  data: string;
  tipo: "APORTE" | "RESGATE" | "RENDIMENTO";
  investimentoId: string;
  createdAt: string;
  updatedAt: string;
  investimento?: {
    id: string;
    nome: string;
    moeda: "BRL" | "USD" | "EUR";
    carteira: {
      id: string;
      nome: string;
    };
  };
}

export interface Cotacoes {
  USD: number;
  EUR: number;
}

export type MoedaInvestimento = "BRL" | "USD" | "EUR";
export type TipoTransacaoInvestimento = "APORTE" | "RESGATE" | "RENDIMENTO";
