# Guia de Troubleshooting - Problemas de Autenticação

## Problema: Não consigo fazer login com usuário criado pelo painel

### 1. Verificar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` contém todas as variáveis necessárias:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu_secret_aleatorio
DATABASE_URL=sua_url_do_banco
```

### 2. Verificar Service Role Key

A `SUPABASE_SERVICE_ROLE_KEY` é essencial para:

- Criar usuários via API
- Autenticar usuários no login

**Como obter:**

1. Acesse o painel do Supabase
2. Vá em Settings > API
3. Copie a "service_role" key (não a "anon" key)

### 3. Verificar Logs do Servidor

Execute o servidor e verifique os logs:

```bash
npm run dev
```

Procure por mensagens como:

- "Criando usuário: { email, name }"
- "Usuário criado com sucesso: [ID]"
- "Login error: [erro]"

### 4. Testar Criação de Usuário

1. Acesse `/configuracoes`
2. Clique em "Novo Usuário"
3. Preencha os dados
4. Verifique se aparece mensagem de sucesso
5. Verifique se o usuário aparece na lista

### 5. Testar Login

1. Vá para `/login`
2. Use as credenciais do usuário criado
3. Verifique se há mensagens de erro

### 6. Verificar no Supabase

1. Acesse o painel do Supabase
2. Vá em Authentication > Users
3. Verifique se o usuário foi criado
4. Verifique se o email está confirmado

### 7. Possíveis Problemas

**Problema:** "Invalid login credentials"

- **Solução:** Verificar se a senha está correta
- **Solução:** Verificar se o email está correto

**Problema:** "User not found"

- **Solução:** Verificar se o usuário foi criado no Supabase
- **Solução:** Verificar se o email está confirmado

**Problema:** "Service role key not found"

- **Solução:** Verificar se `SUPABASE_SERVICE_ROLE_KEY` está no `.env`
- **Solução:** Reiniciar o servidor após adicionar a variável

### 8. Comandos de Debug

```bash
# Verificar se o servidor está rodando
npm run dev

# Verificar logs em tempo real
# (os logs aparecerão no terminal onde o servidor está rodando)

# Testar API diretamente
curl -X GET http://localhost:3000/api/usuarios
```

### 9. Contato

Se o problema persistir, verifique:

1. Se todas as variáveis de ambiente estão corretas
2. Se o Supabase está configurado corretamente
3. Se não há erros no console do navegador
4. Se não há erros no terminal do servidor
