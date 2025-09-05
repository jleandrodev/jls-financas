export interface ContaRecorrente {
  id: string;
  nome: string;
  valor: number;
  descricao?: string;
  diaVencimento: number;
  ativo: boolean;
  userId: string;
  categoriaId: string;
  categoria: {
    id: string;
    nome: string;
    tipo: "ENTRADA" | "SAIDA";
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaRecorrenteData {
  nome: string;
  valor: number;
  descricao?: string;
  diaVencimento: number;
  categoriaId: string;
}

export interface UpdateContaRecorrenteData {
  nome?: string;
  valor?: number;
  descricao?: string;
  diaVencimento?: number;
  ativo?: boolean;
  categoriaId?: string;
}

export interface ContaRecorrenteStatus {
  conta: ContaRecorrente;
  pagoEsteMes: boolean;
  dataUltimoPagamento?: string;
  diasAteVencimento: number;
}
