# Padrões de escrita de código

Estas regras são obrigatórias para todo código produzido ou alterado por
agentes de IA neste repositório. Os exemplos de código são intencionalmente
escritos em inglês; nomes de variáveis, funções, tipos, mensagens e strings de
produção devem seguir o idioma e as convenções já adotados pelo módulo.

## Regras obrigatórias

### Tamanho de arquivos e classes

- Não crie classes ou arquivos `.ts`/`.tsx` com mais de 100 linhas. Arquivos de
  teste são a única exceção.
- Quando um arquivo ou uma classe se aproximar desse limite, extraia partes
  coesas para módulos menores, cada um com uma responsabilidade clara.

```ts
export class OrderService {
  constructor(private readonly repository: OrderRepository) {}
  async create(input: CreateOrderInput): Promise<Order> {
    const order = this.buildOrder(input);
    await this.repository.save(order);
    return order;
  }
  private buildOrder(input: CreateOrderInput): Order {
    return Order.create(input.items, input.customerId);
  }
}
```

### Tamanho e responsabilidade de métodos e funções

- Não crie métodos ou funções com mais de 30 linhas.
- Prefira dividir a lógica em funções menores, com uma única responsabilidade.
- O nome de uma função deve explicar sua intenção; evite funções genéricas que
  acumulam validação, transformação, persistência e resposta HTTP.

```ts
async function registerCustomer(input: RegisterCustomerInput): Promise<Customer> {
  validateCustomerInput(input);
  const customer = buildCustomer(input);
  return customerRepository.save(customer);
}
```

### Linhas em branco dentro de funções e métodos

- Não use linhas em branco dentro de métodos ou funções.
- Linhas em branco podem separar membros de uma classe ou métodos e funções em
  um arquivo.

```ts
function calculateTotal(items: readonly OrderItem[]): number {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}
```

### Aninhamento e cláusulas de guarda

- Não aninhe mais de três níveis de condicionais.
- Prefira cláusulas de guarda e early returns para reduzir o aninhamento.
- Quando houver muitas condições ou condições difíceis de entender, extraia a
  regra para um método ou função cujo nome explique o objetivo final.

```ts
function canCancelOrder(order: Order, actor: Actor): boolean {
  if (order.isCancelled) return false;
  if (!actor.isAuthenticated) return false;
  if (!actor.canManageOrders) return false;
  return isWithinCancellationWindow(order.createdAt);
}
```

```ts
function shouldApplyPriorityShipping(order: Order): boolean {
  return order.total >= PRIORITY_TOTAL && hasEligibleAddress(order) && !order.isPickup;
}
```

### Comentários

- Nunca coloque comentários no código como forma de explicar código comum,
  narrar a implementação ou compensar nomes pouco claros.
- A única exceção são trechos realmente complexos, como uma expressão regular
  de difícil entendimento, quando o comentário explica a razão ou a regra que
  não pode ser expressa de forma melhor no código.
- Prefira nomes explícitos, funções pequenas e tipos que tornem o código
  autoexplicativo.

```ts
const brazilianTaxIdPattern = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
```

### Constantes e valores mágicos

- Nunca use strings ou números mágicos no código.
- Extraia valores relevantes para constantes com nomes que expliquem seu
  significado, facilitando a leitura, a manutenção e a alteração da regra.

```ts
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 500;

function shouldRetry(attempts: number): boolean {
  return attempts < MAX_ATTEMPTS;
}
```

### Declaração e escopo de variáveis

- Declare variáveis próximo do local em que serão utilizadas.
- Evite declarar antecipadamente variáveis que só serão usadas muito depois ou
  que aumentem o escopo sem necessidade.
- Prefira `const`; use `let` somente quando a reatribuição for necessária.

```ts
function formatCustomerName(customer: Customer): string {
  const firstName = customer.firstName.trim();
  const lastName = customer.lastName.trim();
  return `${firstName} ${lastName}`;
}
```

### Secrets e configuração sensível

- Nunca coloque secrets, tokens, senhas ou chaves diretamente no código,
  exemplos executáveis ou arquivos versionados.
- Use variáveis de ambiente e a validação centralizada de configuração.
- Não registre secrets em logs, mensagens de erro ou objetos de resposta.

```ts
const apiKey = process.env.PAYMENT_API_KEY;

if (!apiKey) throw new Error('PAYMENT_API_KEY is required');
```

### Parâmetros de métodos e funções

- Não crie métodos ou funções que recebam mais de três parâmetros.
- Quando forem necessários mais de três dados, use um objeto de parâmetros, de
  preferência representado por um tipo ou DTO nomeado.
- Mantenha os nomes das propriedades explícitos para evitar confusão na ordem
  dos argumentos.

```ts
type CreateInvoiceInput = {
  customerId: string;
  items: readonly InvoiceItem[];
  dueDate: Date;
  notes?: string;
};

function createInvoice(input: CreateInvoiceInput): Invoice {
  return Invoice.create(input);
}
```

## Organização e manutenção

- Preserve a separação entre transporte HTTP, configuração, infraestrutura e
  regras de negócio.
- Evite duplicação; antes de criar uma nova abstração, procure helpers, tipos e
  serviços existentes que possam ser reutilizados.
- Prefira composição e funções pequenas a hierarquias complexas de classes.
- Faça alterações incrementais e mantenha cada arquivo, classe e função focado
  em uma responsabilidade.
- Ao concluir uma alteração, verifique compilação, lint ou testes disponíveis e
  confirme que o código continua obedecendo estas regras.
