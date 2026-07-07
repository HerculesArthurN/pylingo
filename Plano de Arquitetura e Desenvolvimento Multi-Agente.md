# Plano de Arquitetura, Desenvolvimento Multi-Agente e Manual Técnico — PyLingo v2.0

Este documento apresenta a especificação arquitetural guiada pelos princípios SOLID, estabelece o protocolo de colaboração para Múltiplos Agentes de IA Autônomos, detalha o planejamento dos Passos 2 ao 5 e consolida o Manual de Conclusão e Handover Técnico para a plataforma PyLingo v2.0.

---

## 1. Arquitetura do Sistema e Aplicação dos Princípios SOLID

Para garantir que o PyLingo permaneça modular, fácil de estender e testável, a arquitetura da SPA adota estritamente os princípios SOLID:

### 1.1 S - Single Responsibility Principle (Princípio da Responsabilidade Única)
Cada módulo ou hook do sistema possui apenas uma razão conceitual para mudar:
* **useAudio:** Responsável única e exclusivamente por sintetizar frequências sonoras via Web Audio API. Não conhece regras de negócios nem pontuação de usuários.
* **usePyodide:** Responsável exclusiva por instanciar o Web Worker, delegar a execução segura de código com timeout e reportar resultados brutos de saída.
* **progression.ts:** Lida apenas com matemática pura de estado (XP, vidas, coins, desbloqueio). Ele não sabe que o React existe ou como os dados são persistidos ou tocados.
* **Mascot.tsx:** Componente visual encarregado apenas de renderizar o SVG parametrizado com base no humor recebido via propriedades (props) e aplicar animações declarativas do Framer Motion.

```
                    ┌─────────────────────────────────────────┐
                    │          CASCA IMPERATIVA (UI)          │
                    │  (React Components / Monaco / Worker)   │
                    └────────────────────┬────────────────────┘
                                         │
                                         │  Invocação através de Hooks
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │          NÚCLEO FUNCIONAL PURO          │
                    │   (progression.ts / State Transitions)  │
                    └─────────────────────────────────────────┘
```

### 1.2 O - Open/Closed Principle (Princípio Aberto/Fechado)
O sistema de desafios é aberto para extensão de novos tipos de validadores e lições, mas fechado para modificação direta das engines internas.
* Para adicionar novas lições de Machine Learning, POO ou estruturas complexas em fases avançadas, basta alimentar o banco de dados estático `lessonsData.ts` com um novo objeto que respeite o contrato `ILesson`. O motor do Pyodide compilará o novo código sem necessitar de qualquer modificação em suas rotinas internas de execução.

### 1.3 L - Liskov Substitution Principle (Princípio da Substituição de Liskov)
Os objetos de lição e as suítes de testes seguem uma tipagem e interface previsíveis. Qualquer lição que implemente a interface abstrata de lições (`ILesson`) pode ser injetada no componente de foco `ActiveLessonView` sem que a tela do sandbox quebre ou precise de tratamentos condicionais específicos.

### 1.4 I - Interface Segregation Principle (Princípio da Segregação de Interfaces)
Os componentes de UI não dependem de grandes interfaces monolíticas ou estados globais acoplados. As tipagens no arquivo `types.ts` são segregadas em estruturas pequenas e tipos de dados literais específicos (como `HeartsCount` restrito a `0 | 1 | 2 | 3 | 4 | 5` e `MascotMood` restrito a `'happy' | 'thinking' | 'sad' | 'geek'`), evitando re-renderizações desnecessárias e acoplamento rígido de dados.

### 1.5 D - Dependency Inversion Principle (Princípio da Inversão de Dependência)
O motor de execução de código e os componentes de UI de alto nível dependem de abstrações (como a interface `runCode` fornecida por propriedades e tipos de transporte previsíveis), não de implementações de bibliotecas concretas diretamente nos componentes de visualização. Se futuramente decidirmos trocar o Pyodide por uma execução em nuvem baseada em API remota, a camada de visualização não sofrerá alterações, alterando apenas a Casca Imperativa do hook.

---

## 2. Padrão Arquitetural: Núcleo Funcional & Casca Imperativa

O PyLingo separa rigidamente o estado computacional puro e determinístico dos efeitos colaterais inevitáveis de uma aplicação web interativa:

```
                     ┌───────────────────────────────┐
                     │       CASCA IMPERATIVA        │
                     │  - LocalStorage (useLocalStorage)
                     │  - Web Audio API (useAudio)   │
                     │  - Thread de Web Worker       │
                     │  - Monaco Editor Render       │
                     └───────────────┬───────────────┘
                                     │  Invoca funções de negócio
                                     ▼
                     ┌───────────────────────────────┐
                     │     NÚCLEO FUNCIONAL PURO     │
                     │  - Cálculo de XP (addXp)      │
                     │  - Regras de Vidas (deduct)   │
                     │  - Transição de Nós da Árvore │
                     │  - Estado Inicial Imutável    │
                     └───────────────────────────────┘
```

### 2.1 O Núcleo Funcional Puro (Pure Functional Core)
Todas as lógicas de negócio do domínio de gamificação são implementadas como funções puras e determinísticas em `src/core/progression.ts`:
* **Sem Estado Compartilhado Variável:** Nenhuma função altera variáveis globais ou mutáveis.
* **Entradas e Saídas Previsíveis:** Dado o mesmo estado inicial de jogo e uma ação, a saída (novo estado) será idêntica e isenta de efeitos de borda.
* **Testabilidade Imediata:** Permite testes de unidade rápidos usando Vitest sem a necessidade de simular mocks de ambiente do navegador (window, document, áudio ou rede).

### 2.2 A Casca Imperativa (Imperative Shell)
Gerencia todos os efeitos colaterais e interações com barramentos de I/O do hardware ou do browser:
* **Persistência local (`useLocalStorage`):** Escuta alterações de estado e serializa dados no LocalStorage de maneira assíncrona.
* **Emissão de frequências (`useAudio`):** Inicializa osciladores físicos de áudio somente quando eventos limpos no core notificam sucessos ou falhas.
* **Máquina WebAssembly (`usePyodide`):** Controla o ciclo de vida do Web Worker e o timeout da thread de execução do interpretador Python.

---

## 3. Detalhamento dos Passos 2 ao 5 e Otimização Física

### 🚀 PASSO 2: Mascote SVG Reativa (Framer Motion)
Transformar o componente estático do mascote Lingo numa entidade dinâmica que atua como o principal vetor de feedback emocional:
* **Estado Ocioso (Idle/Thinking):** Animação de respiração suave com translação vertical contínua do corpo (`y: [0, -3, 0]`) com duração de 3s em loop infinito e piscadela de olhos espontânea (escala vertical reduzida a 0 a cada 5s durante 150ms).
* **Estado de Sucesso (Happy):** Salto de comemoração com rotação leve (`y: [0, -15, 0], rotate: [0, 5, -5, 0]`) com efeito de mola (spring configuration) e ativação de partículas de confetes SVG flutuantes com opacidade decrescente (`y: [0, -40], opacity: [1, 0]`).
* **Estado de Erro (Sad):** Animação de tremor lateral rápido (`x: [0, -8, 8, -6, 6, 0]`) durante 400ms e lágrima SVG animada que desliza do olho esquerdo e desaparece (`y: [0, 15], opacity: [0, 1, 0]`).
* **Estado Sênior (Geek):** Entrada dos óculos escuros deslizando do topo (`y: [-50, 0]`) com desaceleração elástica.

### 🛠️ PASSO 3: Editor de Código Profissional e Terminal Interativo
Substituição da interface de texto simples por uma IDE em miniatura de alto desempenho:
* **Monaco Editor com Lazy Loading:** Integrado com carregamento preguiçoso (`React.lazy` e `Suspense`) para evitar impacto de performance no carregamento inicial da árvore. Configurações forçam tabSize de 4 espaços, auto-fechamento de chaves/aspas e oculta o minimap para ganho de tela em dispositivos móveis.
* **Terminal de Saída Simulada:** Renderiza saídas de stdout e stderr com formatação CSS de cores apropriadas (texto claro `text-slate-200` para prints comuns e fundo vermelho translúcido `bg-rose-950/40 text-rose-400 border-rose-900` para erros e exceções).

### ⚡ PASSO 4: Casca Imperativa do Motor Pyodide em Web Worker com Timeout
A execução de código Python ocorre inteiramente no cliente via WebAssembly utilizando um Web Worker para evitar travamento da UI Thread do navegador.
* **Timeout de Segurança de 4 Segundos:** O hook `usePyodide` envelopa as mensagens enviadas ao Worker com um timer JavaScript de `4000ms`. Se a execução exceder esse limite (decorrente de loops infinitos como `while True: pass`), o hook aciona `.terminate()` no Worker imediatamente, destrói a thread bloqueada, cria uma nova instância silenciosamente e reporta a falha amigável de timeout ao usuário.

```
  React UI (Main Thread)                   Web Worker (Paralelo)
┌────────────────────────┐               ┌────────────────────────┐
│                        │               │                        │
│ 1. Clique "Verificar"  │               │                        │
│ 2. Dispara Timeout(4s) ├──────────────>│ 3. Executa Código e    │
│                        │  postMessage  │    Testes de Asserção  │
│                        │               │                        │
│ Caso A: Resposta em    │<──────────────┤ 4. Retorna Sucesso/Erro│
│ < 4s (Sucesso/Falha)   │  postMessage  │                        │
│ - Limpa Timer          │               └────────────────────────┘
│ - Atualiza UI          │
│                        │
│ Caso B: Excede 4s      │
│ - Força .terminate()   │
│ - Destrói Worker       │
│ - Abre Novo Worker     │
│ - Exibe Erro Timeout   │
└────────────────────────┘
```

### 📚 PASSO 5: Expansão do Banco de Lições e Suíte de Validação das 11 Fases
Especificação das asserções de testes unitários para validar a progressão técnica rigorosa:

#### A. Validação de Programação Orientada a Objetos (Fase 4)
Garantir a modelagem de classes, encapsulamento de dados e herança:
```python
# Suíte de Testes da Lição de Encapsulamento
assert 'ContaBancaria' in locals(), "A classe 'ContaBancaria' não foi criada."
conta = ContaBancaria("Ana", 100)
assert conta.get_saldo() == 100, "O saldo inicial deve ser recuperado por get_saldo()."
conta.depositar(50)
assert conta.get_saldo() == 150, "Erro ao processar depósito."
try:
    conta.__saldo
    raise AssertionError("O atributo de saldo não deve ser acessível diretamente (use atributos privados com duplo sublinhado: __saldo).")
except AttributeError:
    pass # Correto, atributo está privado
```

#### B. Validação de Estrutura de Dados e Big O (Fase 5)
Resolver problemas algorítmicos complexos (como Listas Ligadas e inversão de pilhas):
```python
# Validador de Inversão de Lista Ligada
assert 'inverter_lista' in locals(), "A função 'inverter_lista' não foi definida."
n3 = Node(3)
n2 = Node(2, n3)
n1 = Node(1, n2)
nova_raiz = inverter_lista(n1)
assert nova_raiz.valor == 3, "A nova raiz da lista deve conter o valor 3."
assert nova_raiz.proximo.valor == 2, "O segundo elemento deve ser o valor 2."
```

#### C. Validação de Algoritmos Big Tech LeetCode Medium/Hard (Fase 11)
Garantir caminhos ótimos e prevenção de caminhos ineficientes em grafos ou programação dinâmica:
```python
# Problema: Encontrar o menor caminho em um grafo (Dijkstra)
assert 'menor_caminho' in locals(), "Função 'menor_caminho' ausente."
grafo = {
    'A': {'B': 1, 'C': 4},
    'B': {'A': 1, 'C': 2, 'D': 5},
    'C': {'A': 4, 'B': 2, 'D': 1},
    'D': {'B': 5, 'C': 1}
}
assert menor_caminho(grafo, 'A', 'D') == 4, "Erro no cálculo do menor caminho. Caminho ótimo deve ser A -> B -> C -> D com custo 4."
```

---

## 4. O Sistema de Feedback Socrático (Pedagogia do Erro)

Uma das diretrizes inegociáveis do PyLingo é nunca expor o código correto de bandeja para o usuário. Aplicamos a pedagogia do erro, convertendo os traços de pilhas (stack traces) de exceções do Python em orientações pedagógicas:

```
[Código do Usuário com Erro] ──> [Filtro de Exceções] ──> [Conversor de Dicas] ──> [Visualização de Dica Socrática]
```

* **Erro de Asserção de Teste:** O test runner extrai o texto amigável do `AssertionError` ("Esperado 'Olá, Mundo!'...") e o exibe como orientação.
* **NameError:** Converte para "Você está tentando utilizar uma palavra ou variável que ainda não foi criada. Verifique se a grafou exatamente igual à sua declaração."
* **SyntaxError:** Converte para "Há um erro na estrutura ortográfica do seu código. Verifique se todas as aspas, parênteses e colchetes foram fechados corretamente."
* **IndentationError:** Converte para "O Python é extremamente rígido com a indentação. Lembre-se de dar exatamente 4 espaços de espaçamento sob a declaração de funções ou condicionais."
* **TypeError (NoneType):** Converte para "Sua função executou, mas não retornou resultado. Lembre-se de utilizar a palavra-chave return ao final da função em vez de apenas imprimir com print()."

---

## 5. Diretrizes de Implantação, Otimização e Escalabilidade (Handover)

* **Otimização de Pacotes (Bundle Size):** Carregar Monaco Editor através de Lazy Loading para manter a interface inicial leve.
* **Política de Caching:** Configurar cabeçalhos HTTP (`Cache-Control: public, max-age=31536000`) para os scripts estáticos de ~6MB do Pyodide, permitindo carregamento local instantâneo a partir da segunda visita do usuário.
* **Sincronização Remota Segura (Evolução de Nuvem):** Utilizar autenticação silenciosa no banco de dados e gravar dados do progresso sob caminhos (paths) restritos contendo o ID do usuário para total isolamento de segurança: `/artifacts/{appId}/users/{userId}/{collectionName}`. Utilizar termos puramente voltados para a experiência do usuário como "salvar progresso" em vez de termos técnicos de infraestrutura.