# 💰 Finanças Pessoais

Uma aplicação completa de gerenciamento financeiro pessoal construída com Next.js 14, Supabase, Prisma e TailwindCSS.

## 🚀 Funcionalidades

- **Autenticação**: Login e registro de usuários com Supabase Auth
- **Categorias**: Criação, edição e exclusão de categorias de entrada e saída
- **Transações**: Gerenciamento completo de transações financeiras
- **Dashboard**: Visualização de saldo, gráficos e relatórios
- **Filtros**: Filtros por categoria e período nas transações
- **Responsivo**: Interface adaptável para desktop e mobile

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **ORM**: Prisma
- **Gráficos**: Recharts
- **Autenticação**: NextAuth.js

## 📦 Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd financas-pessoais
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Database
   DATABASE_URL=your_database_url
   ```

4. **Configure o banco de dados**

   ```bash
   # Gerar o cliente Prisma
   npx prisma generate

   # Aplicar as migrações
   npx prisma db push

   # (Opcional) Popular com dados de exemplo
   npx prisma db seed
   ```

5. **Execute a aplicação**
   ```bash
   npm run dev
   ```

## 🗄️ Estrutura do Banco

### Tabelas

- **categorias**: Categorias de entrada e saída
- **transacoes**: Transações financeiras
- **auth.users**: Usuários (gerenciado pelo Supabase)

### Relacionamentos

- Cada categoria pertence a um usuário
- Cada transação pertence a um usuário e uma categoria
- Row Level Security (RLS) ativado para isolamento de dados

## 🔐 Segurança

- **Autenticação**: Supabase Auth com NextAuth.js
- **Autorização**: Middleware protegendo rotas sensíveis
- **Isolamento**: RLS garantindo que usuários só vejam seus dados
- **Validação**: Validação de dados no frontend e backend

## 📱 Páginas

- **`/`**: Redirecionamento baseado no status de autenticação
- **`/login`**: Página de login e registro
- **`/dashboard`**: Dashboard com resumos e gráficos
- **`/transacoes`**: Lista e gerenciamento de transações
- **`/categorias`**: Gerenciamento de categorias

## 🎨 Componentes

- **Modal**: Componente base para modais
- **CategoriaModal**: Modal para criar/editar categorias
- **TransacaoModal**: Modal para criar/editar transações
- **Navigation**: Barra de navegação principal

## 📊 API Routes

- **`/api/categorias`**: CRUD de categorias
- **`/api/transacoes`**: CRUD de transações
- **`/api/dashboard`**: Dados para o dashboard
- **`/api/auth/[...nextauth]`**: Configuração do NextAuth

## 🧪 Hooks Personalizados

- **`useCategorias`**: Gerenciamento de categorias
- **`useTransacoes`**: Gerenciamento de transações
- **`useDashboard`**: Dados do dashboard

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Linting
npm run lint
npm run lint:fix

# Prisma
npm run db:generate  # Gerar cliente
npm run db:push      # Aplicar migrações
npm run db:migrate   # Criar migração
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Popular banco
```

## 📈 Próximos Passos

- [ ] Relatórios em PDF
- [ ] Importação de dados (CSV/Excel)
- [ ] Metas financeiras
- [ ] Categorias personalizáveis
- [ ] Notificações
- [ ] App mobile (React Native)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando Next.js, Supabase e Prisma.
