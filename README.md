# 🍔 Dev Burguer API

API REST para gerenciamento de um sistema de hamburgueria: cadastro de usuários, autenticação, categorias, produtos (com upload de imagem) e pedidos.

Construída com **Node.js + Express**, usando **PostgreSQL** (via Sequelize) para dados relacionais (usuários, produtos, categorias) e **MongoDB** (via Mongoose) para os pedidos.

## Sumário

- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração (banco de dados e segredos)](#configuração-banco-de-dados-e-segredos)
- [Executando o projeto](#executando-o-projeto)
- [Autenticação](#autenticação)
- [Endpoints da API](#endpoints-da-api)
  - [Usuários](#usuários)
  - [Login](#login)
  - [Categorias](#categorias)
  - [Produtos](#produtos)
  - [Pedidos](#pedidos)
  - [Arquivos estáticos](#arquivos-estáticos)
- [Modelos de dados](#modelos-de-dados)
- [Upload de imagens](#upload-de-imagens)
- [Migrations](#migrations)
- [Problemas conhecidos](#problemas-conhecidos)
- [Roadmap / melhorias sugeridas](#roadmap--melhorias-sugeridas)
- [Licença](#licença)

## Tecnologias

- [Node.js](https://nodejs.org/) (ESM, `"type": "module"`)
- [Express 5](https://expressjs.com/)
- [Sequelize](https://sequelize.org/) + [PostgreSQL](https://www.postgresql.org/) — usuários, produtos e categorias
- [Mongoose](https://mongoosejs.com/) + [MongoDB](https://www.mongodb.com/) — pedidos
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken) — autenticação
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hash de senhas
- [multer](https://www.npmjs.com/package/multer) — upload de imagens
- [yup](https://github.com/jquense/yup) — validação de payloads
- [uuid](https://www.npmjs.com/package/uuid) — geração de IDs/nome de arquivos
- [Biome](https://biomejs.dev/) — lint/format
- Gerenciador de pacotes: [pnpm](https://pnpm.io/)

## Estrutura de pastas

```
Dev-burguer-api/
├── uploads/                     # imagens enviadas (produtos e categorias)
└── src/
    ├── app.js                   # configuração do Express (middlewares e rotas)
    ├── server.js                # ponto de entrada, sobe o servidor na porta 3001
    ├── routes.js                # definição de todas as rotas da API
    ├── app/
    │   ├── controllers/
    │   │   ├── userController.js
    │   │   ├── loginController.js
    │   │   ├── productsController.js
    │   │   ├── categoriesController.js
    │   │   └── orderController.js
    │   ├── middlewares/
    │   │   ├── auth.js          # validação do token JWT
    │   │   └── admin.js         # exige usuário administrador
    │   ├── models/               # modelos Sequelize (Postgres)
    │   │   ├── User.js
    │   │   ├── Products.js
    │   │   └── Categories.js
    │   └── schemas/
    │       └── Order.js          # schema Mongoose (MongoDB)
    ├── config/
    │   ├── auth.js               # segredo/expiração do JWT
    │   ├── database.cjs          # configuração de conexão com o Postgres
    │   ├── multer.cjs            # configuração de storage do multer
    │   └── fileRoutes.cjs        # servidor de arquivos estáticos (uploads)
    └── database/
        ├── index.js               # inicializa Sequelize + Mongoose e associações
        └── migrations/            # migrations do Sequelize
```

## Pré-requisitos

- Node.js 18+ (o script `dev` usa `node --watch`)
- [pnpm](https://pnpm.io/)
- Um servidor **PostgreSQL** rodando localmente
- Um servidor **MongoDB** rodando localmente

## Instalação

```bash
git clone https://github.com/Almirodesouza/Dev-burguer-api.git
cd Dev-burguer-api
pnpm install
```

## Configuração (banco de dados e segredos)

> ⚠️ Atualmente as credenciais e segredos ficam hardcoded no código-fonte (não há `.env`). Ajuste os arquivos abaixo antes de rodar o projeto localmente, ou adapte para variáveis de ambiente.

**PostgreSQL** — [src/config/database.cjs](src/config/database.cjs):

```js
{
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: '29209021',
  database: 'dev-burguer-db',
}
```

Crie o banco `dev-burguer-db` no seu Postgres local (ou ajuste este arquivo para apontar para outra instância).

**MongoDB** — [src/database/index.js](src/database/index.js):

```js
mongoose.connect('mongodb://localhost:27017/devburguer');
```

O banco `devburguer` é criado automaticamente na primeira conexão.

**JWT** — [src/config/auth.js](src/config/auth.js): segredo e tempo de expiração (padrão `7d`) do token.

Depois de configurar os bancos, rode as migrations do Sequelize:

```bash
npx sequelize-cli db:migrate
```

## Executando o projeto

```bash
pnpm dev
```

Isso inicia o servidor com hot-reload (`node --watch`) em `http://localhost:3001`.

> Não há scripts de `start`, `build` ou `test` configurados no `package.json`, tampouco testes automatizados no projeto.

## Autenticação

A API usa **JWT**. As rotas `POST /users` e `POST /login` são públicas; todas as demais exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido em `POST /login` e carrega `id`, `name` e `admin` no payload. Rotas marcadas como **admin** também passam por um middleware que verifica se `admin: true`.

## Endpoints da API

Base URL: `http://localhost:3001`

### Usuários

| Método | Rota | Autenticação |
|---|---|---|
| POST | `/users` | Não |

**POST /users** — cria um novo usuário.

Body (JSON):
```json
{
  "name": "string, obrigatório",
  "email": "string, obrigatório, formato de e-mail",
  "password": "string, obrigatório, mínimo 6 caracteres",
  "admin": "boolean, opcional"
}
```

Resposta `201`:
```json
{ "id": "uuid", "name": "...", "email": "..." }
```

Resposta `400` se o e-mail já estiver cadastrado.

### Login

| Método | Rota | Autenticação |
|---|---|---|
| POST | `/login` | Não |

**POST /login**

Body (JSON):
```json
{ "email": "string, obrigatório", "password": "string, obrigatório, mínimo 6 caracteres" }
```

Resposta `200`:
```json
{ "id": "...", "name": "...", "email": "...", "admin": false, "token": "jwt..." }
```

Resposta `400` se e-mail ou senha forem inválidos.

### Categorias

| Método | Rota | Autenticação | Admin |
|---|---|---|---|
| GET | `/categories` | Sim | Não |
| POST | `/categories` | Sim | Sim |
| PUT | `/categories/:id` | Sim | Sim |

**GET /categories** — lista todas as categorias.

**POST /categories** — cria uma categoria. `multipart/form-data`:
- `name` (string, obrigatório)
- `file` (arquivo de imagem, obrigatório)

**PUT /categories/:id** — atualiza uma categoria. `multipart/form-data`:
- `name` (string, opcional)
- `file` (arquivo de imagem, opcional)

### Produtos

| Método | Rota | Autenticação | Admin |
|---|---|---|---|
| GET | `/products/` | Sim | Não |
| POST | `/products` | Sim | Sim |
| PUT | `/products/:id` | Sim | Sim |

**GET /products/** — lista todos os produtos, incluindo a categoria associada (`{ id, name }`) e a `url` da imagem.

**POST /products** — cria um produto. `multipart/form-data`:
- `name` (string, obrigatório)
- `price` (number, obrigatório)
- `category_id` (number, obrigatório)
- `offer` (boolean, opcional)
- `file` (arquivo de imagem, obrigatório)

**PUT /products/:id** — atualiza um produto (todos os campos acima opcionais, mesmo formato).

### Pedidos

| Método | Rota | Autenticação | Admin |
|---|---|---|---|
| GET | `/orders` | Sim | Não |
| POST | `/orders` | Sim | Não |
| PUT | `/orders/:id` | Sim | Sim |

**GET /orders** — lista todos os pedidos.

**POST /orders** — cria um pedido a partir dos produtos informados (o usuário é identificado pelo token).

Body (JSON):
```json
{
  "products": [
    { "id": 1, "quantity": 2 },
    { "id": 3, "quantity": 1 }
  ]
}
```

Resposta `201` com o pedido criado, contendo usuário, produtos (nome, preço, categoria, imagem, quantidade) e status inicial `"Pedido realizado"`.

**PUT /orders/:id** — atualiza o status de um pedido (`:id` é o `_id` do MongoDB).

Body (JSON):
```json
{ "status": "string, obrigatório" }
```

### Arquivos estáticos

As imagens enviadas ficam disponíveis publicamente em:

```
GET /products-file/:filename
GET /categories-file/:filename
```

(ambas servem o mesmo diretório `uploads/`).

## Modelos de dados

### User (PostgreSQL)

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID | chave primária |
| name | STRING | obrigatório |
| email | STRING | obrigatório, único |
| password_hash | STRING | hash gerado com bcrypt |
| admin | BOOLEAN | padrão `false` |
| created_at / updated_at | DATE | |

### Categories (PostgreSQL)

| Campo | Tipo | Observações |
|---|---|---|
| id | INTEGER | chave primária, auto incremento |
| name | STRING | obrigatório, único |
| path | STRING | nome do arquivo de imagem |
| url | VIRTUAL | URL completa da imagem (calculada) |
| created_at / updated_at | DATE | |

### Products (PostgreSQL)

| Campo | Tipo | Observações |
|---|---|---|
| id | INTEGER | chave primária, auto incremento |
| name | STRING | obrigatório |
| price | INTEGER | obrigatório |
| path | STRING | nome do arquivo de imagem |
| category_id | INTEGER | FK → `categories.id` |
| offer | BOOLEAN | padrão `false` |
| url | VIRTUAL | URL completa da imagem (calculada) |
| created_at / updated_at | DATE | |

Relação: um produto pertence a uma categoria (`Products.belongsTo(Categories)`).

### Order (MongoDB)

```js
{
  user: { id: String, name: String },
  products: [
    {
      id: Number,
      name: String,
      price: String,
      category: String,
      quantity: Number,
      url: String,
    }
  ],
  status: String,
  createdAt: Date,
  updatedAt: Date,
}
```

## Upload de imagens

- Upload feito via `multer`, campo do formulário: `file`.
- Arquivos são salvos em `uploads/` com o nome `<uuid>-<nome-original>`.
- Servidos estaticamente pelas rotas `/products-file` e `/categories-file`.

## Migrations

As migrations do Sequelize ficam em `src/database/migrations` e cobrem:

1. Criação da tabela `users`
2. Criação da tabela `products`
3. Criação da tabela `categories`
4. Remoção da coluna `category` (string) de `products`
5. Adição da coluna `category_id` (FK) em `products`
6. Adição da coluna `offer` em `products`
7. Adição da coluna `path` em `categories`

Para rodar todas as migrations pendentes:

```bash
npx sequelize-cli db:migrate
```

## Problemas conhecidos

Estes comportamentos foram identificados lendo o código-fonte atual e valem a atenção de quem for consumir ou evoluir a API:

- **`POST /login` não interrompe a execução em caso de credenciais inválidas.** A função interna `emailOrPasswordIsInvalid()` envia a resposta `400`, mas o código não usa `return` após chamá-la, então o fluxo continua e tenta comparar a senha mesmo sem um usuário encontrado — isso lança uma exceção não tratada (o `existingUser` é `null`) e pode derrubar a requisição em vez de simplesmente responder `400`.
- **`PUT /categories/:id` recusa atualizações que não mudam o nome.** A verificação de nome duplicado (`Categories.findOne({ where: { name } })`) não exclui o próprio registro sendo atualizado, então enviar o mesmo `name` atual (ou até atualizar só a imagem, se `name` for reenviado) resulta em `400 Category already exists`.
- **`file` é obrigatório "na prática" em `POST /products` e `POST /categories`**, mesmo não estando marcado como obrigatório no schema de validação (Yup): o controller acessa `request.file.filename` diretamente, e sem arquivo enviado a requisição quebra com erro 500 em vez de um `400` amigável.
- **`PUT /categories/:id` responde `201`** (em vez do `200`, mais convencional para atualização) e retorna corpo vazio.
- **Credenciais e segredos hardcoded**: senha do Postgres, string de conexão do MongoDB e segredo do JWT estão em texto plano no repositório (veja [Configuração](#configuração-banco-de-dados-e-segredos)) — importante trocar antes de qualquer uso além do ambiente local.

## Roadmap / melhorias sugeridas

- Mover credenciais e segredos (Postgres, MongoDB, JWT, porta do servidor) para variáveis de ambiente (`.env` + `dotenv`), em vez de valores fixos no código.
- Corrigir os problemas de fluxo listados em [Problemas conhecidos](#problemas-conhecidos) (early return no login, exclusão do próprio id na checagem de nome duplicado, validação do upload obrigatório).
- Adicionar testes automatizados (não há nenhum no momento).
- Adicionar scripts `start`, `test` e `migrate` ao `package.json`.
- Tornar a porta do servidor e a URL base das imagens configuráveis.

## Licença

Distribuído sob a licença **ISC** (conforme `package.json`).
