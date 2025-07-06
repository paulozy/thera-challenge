<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Thera-Chall API

## Descrição

API RESTful para gerenciamento de pedidos e produtos, desenvolvida com NestJS, com foco em boas práticas (SOLID), organização de código em camadas (controller, service, repository), e manipulação de banco de dados.

## Funcionalidades

### Produtos

- Criar, listar, editar e deletar produtos.
- Campos do produto: `id`, `nome`, `categoria`, `descrição`, `preço`, `quantidade_estoque`.

### Pedidos

- Criar e listar pedidos.
- Campos do pedido: `id`, `produtos` (lista de produtos), `total_pedido`, `status` ("Pendente", "Concluído", "Cancelado").
- Ao criar um pedido, o sistema verifica a disponibilidade de estoque e atualiza as quantidades.

### Autenticação

- Acesso seguro à API utilizando tokens JWT.

## Tecnologias

- **Node.js**
- **NestJS**
- **Prisma**
- **PostgreSQL**
- **Docker**
- **Swagger**

## Setup do Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20 ou superior)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/thera-chall.git
   cd thera-chall
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Crie um arquivo `.env` na raiz do projeto e adicione a variável de ambiente do banco de dados:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestjs_db?schema=public"
   ```

### Preparar Banco de Dados

Para aplicar as migrações e popular o banco de dados com dados iniciais:

```bash
pnpm run prepare:db
```

### Executando com Docker

Para subir o ambiente de desenvolvimento com Docker, execute:

```bash
docker-compose up -d
```

Para subir a aplicação em modo de desenvolvimento:

```bash
docker-compose run --rm --service-ports app-dev
```

Para subir a aplicação em modo de produção:

```bash
docker-compose run --rm --service-ports app-prod
```

### Executando Localmente

Para executar a aplicação em modo de desenvolvimento:

```bash
pnpm run start:dev
```

Para compilar e executar em modo de produção:

```bash
pnpm run build
pnpm run start:prod
```

## Testes

Para rodar os testes unitários:

```bash
pnpm run test
```

Para rodar os testes e2e:

```bash
pnpm run test:e2e
```

Para ver a cobertura de testes:

```bash
pnpm run test:cov
```

## Documentação da API

A documentação da API está disponível em Swagger. Após iniciar a aplicação, acesse:

[http://localhost:3000/docs](http://localhost:3000/docs)