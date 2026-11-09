# AGENTS.md

## Visão geral

- `ember-pdv` é um repositório com o backend implementado e uma área mobile
  apenas planejada.
- Atualmente, não existe o diretório `mobile/`; a única aplicação executável
  está em `backend/`.
- O backend expõe uma API REST em Fastify e usa PostgreSQL localmente via
  Docker Compose.

## Estrutura relevante

- `backend/src/main.ts`: ponto de entrada, inicialização do servidor e
  encerramento gracioso.
- `backend/src/infra/config/env.ts`: carregamento e validação das variáveis de
  ambiente com Zod. A API carrega `backend/.env.local`.
- `backend/src/infra/database/postgres/pool.ts`: pool PostgreSQL e helper
  genérico `query`.
- `backend/src/infra/http/fastify/app.ts`: criação da aplicação Fastify,
  registro das rotas e fechamento do banco no hook `onClose`.
- `backend/src/infra/http/fastify/routes/`: rotas HTTP; atualmente há apenas
  `health.route.ts`.
- `backend/migrations/`: diretório do `node-pg-migrate`; por enquanto contém
  apenas `.gitkeep`, sem migrations de schema.
- `backend/docker/compose.yml`: definição do serviço PostgreSQL local.
- `backend/.env.example`: modelo de configuração.
- `backend/.nvmrc`: fixa o Node.js em `22.23.4`.

## Stack e convenções

- Node.js `22.23.4`, conforme `backend/.nvmrc` e `engines` do
  `backend/package.json`, com npm `10.9.9` indicado por `packageManager`.
- TypeScript em modo strict, com módulos ESM (`NodeNext`); imports locais
  devem usar a extensão `.js`.
- Fastify para HTTP, `pg` para PostgreSQL, Zod para validação e dotenv para
  configuração.
- O `tsconfig` compila `backend/src` para `backend/dist`; `dist/` é artefato
  gerado e não deve ser editado manualmente.
- Não há framework de testes nem scripts de teste configurados. A verificação
  disponível é `npm run build`.

## Desenvolvimento

Execute os comandos a partir de `backend/`:

```bash
npm install
cp .env.example .env.local
npm run build
npm run dev
```

O arquivo `.env.local` é lido pela API em `src/infra/config/env.ts`, pelo
Docker Compose e pelo `node-pg-migrate`. Ele é ignorado pelo Git. O arquivo
`.env.example` deve ser mantido atualizado quando novas variáveis forem
necessárias.

O script `dev` sobe o PostgreSQL, espera o healthcheck do serviço, aplica as
migrations pendentes e inicia a API com `tsx watch`.

Scripts disponíveis:

```bash
npm run build
npm run dev
npm run services:up
npm run services:down
npm run migrations:up
npm run migrations:create -- nome_da_migration
```

Não existem scripts `start`, `test`, `db:*` ou `migrations:down` no
`package.json`. Para executar a aplicação compilada, use:

```bash
npm run build
node dist/main.js
```

Para desfazer uma migration manualmente, use o CLI com o mesmo arquivo de
ambiente do script de subida:

```bash
npx node-pg-migrate --envPath .env.local -m migrations down
```

Para acompanhar os logs do PostgreSQL, use:

```bash
docker compose --env-file .env.local -f docker/compose.yml -p ember-pdv logs -f postgres
```

O PostgreSQL local usa a imagem `postgres:18-alpine`, o serviço `postgres` e o
volume persistente `postgres_data`. O Compose publica a porta `5432` do
container na porta `5432` do host; alterar `POSTGRES_PORT` no ambiente, sem
alterar o Compose, não muda esse mapeamento.

## Configuração e banco

- A API dá precedência a `DATABASE_URL` sobre as variáveis separadas
  `POSTGRES_*`.
- O `node-pg-migrate` também usa `DATABASE_URL` por padrão; o arquivo
  `.env.local` de desenvolvimento deve mantê-la definida.
- `DATABASE_SSL` aceita apenas `true` ou `false`; quando habilitado, o pool usa
  SSL com `rejectUnauthorized: false`.
- As variáveis da API são validadas na inicialização. Porta inválida,
  credencial vazia ou outro valor fora do schema impede a aplicação de iniciar.
- O pool usa `DATABASE_POOL_MAX` (padrão 10), timeout de conexão de 5 segundos
  e timeout de inatividade de 30 segundos.
- O Compose fornece `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD` ao
  container. A configuração padrão está em `.env.example`.

## Comportamento da API

- `GET /health` executa `SELECT 1` no PostgreSQL.
- Com aplicação e banco disponíveis, responde `200` com
  `{ "status": "ok", "database": "ok" }`.
- Se o banco estiver indisponível, responde `503` com
  `{ "status": "error", "database": "unavailable" }`.
- `SIGINT` e `SIGTERM` fecham o Fastify; o hook `onClose` encerra o pool do
  PostgreSQL antes do processo terminar.

## Cuidados ao alterar o projeto

- Reutilizar o pool e o helper `query` existentes; não abrir conexões
  PostgreSQL avulsas por rota.
- Adicionar alterações persistentes do schema como migrations em
  `backend/migrations/`, em vez de alterar o banco manualmente.
- Preservar a validação centralizada de ambiente e o encerramento gracioso ao
  modificar a inicialização.
- Ao adicionar uma rota, registrá-la em `backend/src/infra/http/fastify/app.ts`
  ou em um módulo de rotas registrado por ele.
- Usar `.env.local` como arquivo de configuração em todo o fluxo de
  desenvolvimento: API, Compose e migrations.
