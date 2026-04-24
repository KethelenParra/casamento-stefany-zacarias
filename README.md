# Zacarias & Stefany — Site de Casamento

Site de casamento com lista de presentes, mural de recados e página institucional do casal.

---

## Tecnologias

- **React 18** — interface
- **Vite** — build e servidor de desenvolvimento
- **Tailwind CSS** — estilização
- **Supabase** — banco de dados e storage de imagens
- **Lucide React** — ícones

---

## Estrutura do projeto

```
src/
├── config/
│   └── supabase.js        # cliente Supabase configurado com variáveis de ambiente
├── components/
│   ├── Navbar.jsx
│   ├── TabBar.jsx
│   ├── Footer.jsx
│   └── modals/
│       ├── GiftModal.jsx  # modal de presentear / deixar recado
│       └── ExchangeModal.jsx  # modal de trocar presente
├── pages/
│   ├── HomePage.jsx       # página inicial com história do casal
│   ├── ListaPresente.jsx  # lista de presentes com filtros e animações
│   └── Recardo.jsx        # mural de recados e vídeos da família
├── data/
│   └── constants.js       # dados estáticos (vídeos, mensagens iniciais)
├── utils/
│   └── phone.js           # formatação e validação de telefone BR
└── App.jsx                # estado global e roteamento por estado
```

---

## Banco de dados (Supabase)

### Tabela `gifts`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | serial | chave primária |
| `name` | text | nome do presente |
| `description` | text | descrição |
| `category` | text | cozinha / sala / quarto / lavanderia |
| `reserved` | boolean | se já foi escolhido |
| `reserved_by_name` | text | nome de quem reservou |
| `reserved_by_phone` | text | telefone de quem reservou |
| `image_url` | text | URL da imagem do produto |

### Tabela `messages`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid | chave primária |
| `author` | text | nome de quem enviou |
| `text` | text | mensagem |
| `gift_name` | text | presente associado (opcional) |
| `created_at` | timestamptz | data de criação (automático) |

### RLS (Row Level Security)

Ambas as tabelas têm RLS ativado com as seguintes políticas públicas (acesso anônimo):

- `gifts` — leitura e atualização públicas
- `messages` — leitura e inserção públicas

---

## Configuração e execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

As chaves estão em **Supabase > Project Settings > API**.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Gerar build de produção

```bash
npm run build
```

---

## Funcionalidades

### Lista de presentes
- Filtro por categoria (cozinha, sala, quarto, lavanderia)
- Animação de entrada conforme scroll (aparece e some ao subir/descer)
- Exibe imagem do produto quando disponível, ícone quando não
- Botão "Presentear" abre modal com nome, telefone e mensagem opcional
- Botão "Trocar meu Presente" permite trocar um presente reservado pelo telefone

### Mural de recados
- Lista de mensagens dos convidados em ordem cronológica inversa
- Possibilidade de deixar mensagem sem presente associado

### Página inicial
- História do casal
- Fotos
- Vídeos da família (estáticos)

---

## Como adicionar imagens aos presentes

**Via Supabase Storage:**
1. Crie um bucket chamado `gifts` marcado como **Public**
2. Faça upload da imagem do produto
3. Copie a URL pública (clique na imagem > Copy URL)
4. Atualize no banco via **Table Editor** ou SQL:

```sql
update gifts set image_url = 'https://sua-url.supabase.co/storage/v1/object/public/gifts/nome-do-arquivo.jpg'
where name = 'Nome do Presente';
```

---

## Observações

- O arquivo `.env` nunca deve ser commitado (já está no `.gitignore`)
- A dependência `firebase` está no `package.json` mas não é utilizada — pode ser removida futuramente
