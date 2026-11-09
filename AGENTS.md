# AGENTS.md

## Contexto do projeto

- Ember PDV é um sistema de ponto de venda.
- O backend é uma aplicação Node.js/TypeScript com Fastify e PostgreSQL. O
  acesso ao banco é feito por um pool compartilhado, e as alterações de schema
  são controladas por migrations.
- A configuração é carregada a partir de variáveis de ambiente e validada na
  inicialização. O ambiente local usa PostgreSQL provisionado pelo Docker
  Compose.
- A aplicação deve permanecer independente de um cliente específico: regras e
  dados expostos pela API não devem depender de detalhes de uma interface web,
  mobile ou outra camada de apresentação.

## Convenções de implementação

- O código TypeScript usa modo strict e módulos ESM; imports locais devem usar
  a extensão `.js`.
- Artefatos gerados não devem ser editados manualmente.
- Use `.env.local` no desenvolvimento e mantenha `.env.example` atualizado
  quando novas variáveis de ambiente forem necessárias.
- Preserve a validação centralizada de ambiente e o encerramento gracioso da
  aplicação ao modificar a inicialização.
- Reutilize o pool e os helpers de acesso ao banco existentes; não abra
  conexões avulsas em rotas ou serviços.
- Registre novas rotas pelo módulo de aplicação HTTP ou por um módulo de rotas
  que ele registre.
- Faça alterações persistentes no schema por meio de migrations, em vez de
  alterar o banco manualmente.

## Desenvolvimento e verificação

- Execute os comandos do backend a partir do diretório da aplicação e use o
  arquivo de ambiente local previsto pelo projeto.
- Antes de entregar alterações TypeScript, execute o build disponível e corrija
  erros de compilação.
- Ao alterar configuração, banco ou inicialização, verifique também o fluxo de
  subida e encerramento da aplicação.
