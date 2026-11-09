# Backend

API REST do Ember PDV para gestão de foodtrucks.

## Desenvolvimento local

O projeto usa Node.js `22.23.4` e npm. A API depende de um PostgreSQL local
executado pelo Docker Compose.

Execute os comandos a partir deste diretório:

```bash
npm install
cp .env.example .env.local
npm run dev
```

O arquivo `.env.local` é carregado pela API, pelo Docker Compose e pelo
`node-pg-migrate`. Ele é local e ignorado pelo Git. O script `dev` sobe o
serviço `postgres`, espera o healthcheck, aplica as migrations pendentes e
inicia a API em modo watch.

## Scripts disponíveis

Executados dentro de `backend/`:

```bash
npm run build                              # compila src/ para dist/
npm run dev                                # PostgreSQL + migrations + API em watch
npm run services:up                        # sobe o PostgreSQL
npm run services:down                      # para o PostgreSQL sem remover o volume
npm run migrations:up                      # aplica migrations pendentes
npm run migrations:create -- add_products  # cria uma nova migration
```

Não há scripts `start`, `test`, `db:*` ou `migrations:down` configurados.
Para desfazer uma migration, execute o CLI diretamente:

```bash
npx node-pg-migrate --envPath .env.local -m migrations down
```

Para acompanhar os logs do PostgreSQL:

```bash
docker compose --env-file .env.local -f docker/compose.yml -p ember-pdv logs -f postgres
```

Para executar a aplicação compilada:

```bash
npm run build
node dist/main.js
```

## Deploy no Fly.io

O backend inclui um `Dockerfile` multi-stage e uma configuração em
`fly.toml`. Execute os comandos a partir deste diretório:

```bash
fly auth login
fly launch --no-deploy
```

Se necessário, altere o valor de `app` em `fly.toml` para um nome disponível na
sua conta. Antes do primeiro deploy, configure a URL do PostgreSQL como secret:

```bash
fly secrets set DATABASE_URL='postgresql://usuario:senha@host:5432/banco'
fly deploy
```

O Fly encaminha HTTPS para a porta interna `3000` e usa `GET /health` como
health check. Como esse endpoint também valida o PostgreSQL, a aplicação só é
considerada saudável quando o banco estiver acessível.

## PostgreSQL local

O banco roda no serviço `postgres` do Docker Compose, usando a imagem oficial
`postgres:18-alpine`. Os dados ficam no volume persistente `postgres_data`.
O Compose publica a porta `5432` do container na porta `5432` do host.

A API usa `DATABASE_URL` quando definida e, caso contrário, monta a conexão a
partir das variáveis `POSTGRES_*`. O `node-pg-migrate` usa `DATABASE_URL` por
padrão, por isso ela deve continuar definida em `.env.local` para as
migrations.

A conexão da aplicação é gerenciada por um pool do `pg`; o endpoint
`GET /health` verifica também a disponibilidade do PostgreSQL.

As variáveis de ambiente da API são carregadas e validadas com Zod durante a
inicialização. Valores inválidos, como uma porta que não seja um número ou
`DATABASE_SSL` diferente de `true`/`false`, fazem a aplicação falhar antes de
iniciar.

O diretório `migrations/` ainda não contém migrations de schema; atualmente ele
possui apenas `.gitkeep`.
