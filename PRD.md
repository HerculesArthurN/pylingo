Product Requirement Document (PRD) - PyLingo v2.0

1. Visão Geral do Produto

O PyLingo é uma plataforma web SPA (Single Page Application) gamificada de aprendizado de programação em Python, fortemente inspirada na experiência de usuário (UX) do Duolingo. O produto foi projetado para guiar usuários sem qualquer conhecimento prévio de computação até a proficiência necessária para resolver problemas complexos de estrutura de dados e algoritmos (nível LeetCode Medium/Hard) e obter aprovação em entrevistas técnicas de Big Techs.

1.1 Objetivo Supremo

Democratizar o ensino de engenharia de software de ponta, removendo barreiras de configuração de ambiente local (compiladores, interpretadores, terminais) através do uso de WebAssembly diretamente no navegador do usuário, com um ciclo de feedback instantâneo e divertido.

2. Personas e Público-Alvo

O Iniciante Absoluto (Zero Tech): Pessoas em transição de carreira ou curiosos que nunca escreveram uma linha de código. Necessitam de instruções simples, metáforas cotidianas e estímulos visuais rápidos para reter o foco.

O Estudante Intermediário: Conhece o básico de lógica, mas se perde na sintaxe ou desiste diante de termos complexos. Precisa de feedback instrutivo estruturado (Dicas Socráticas) sem que a resposta seja entregue de bandeja.

O Aspirante a Big Tech: Desenvolvedores focados em passar em processos seletivos. Precisam de um playground ágil e desafios com asserções rigorosas para dominar algoritmos e complexidade computacional ($O(1)$, $O(N)$, $O(N \log N)$).

3. Requisitos Funcionais (FR)

FR-01: Árvore de Aprendizado Dinâmica (Learning Tree)

O sistema deve exibir uma trilha vertical e interativa de lições conectadas.

Um nó de lição só deve ser desbloqueado se todos os seus nós predecessores imediatos estiverem marcados como concluídos.

Cada nó deve indicar visualmente seu status: Bloqueado (cinza/cadeado), Disponível (borda vibrante/ativo) ou Concluído (verde/check).

FR-02: Sistema de Vidas (Corações)

O usuário inicia com um máximo de 5 vidas.

Cada submissão de código que falhe nas asserções de teste consome exatamente 1 vida.

Se as vidas chegarem a 0, o usuário fica impedido de realizar testes de lições até recuperar vidas.

Recuperação de Vidas: O usuário pode trocar 20 LingoCoins por 1 vida na Loja, ou aguardar uma simulação de regeneração temporal.

FR-03: Sistema de Ofensiva (Streak) e Moedas (LingoCoins)

O sistema deve rastrear e exibir os dias consecutivos de prática do usuário.

Ao concluir lições diárias, o usuário ganha LingoCoins (moeda interna da plataforma) e XP (Pontos de Experiência).

FR-04: Mascote Reativo SVG (Lingo)

O mascote (uma cobra píton expressiva) deve adaptar suas feições dinamicamente para 4 humores principais:

Feliz/Comemorando (happy): Acionada ao passar em desafios, concluir lições ou equipar itens.

Pensativo/Focado (thinking): Estado padrão durante a leitura ou escrita do código.

Triste/Preocupado (sad): Ativado quando o usuário perde uma vida ou erra um desafio.

Estilo Sênior/Tech (geek): Visual cosmético desbloqueável na Loja (óculos escuros).

FR-05: Editor de Código e Terminal Integrados

Um editor de texto voltado para codificação (com auto-indentação e destaque de sintaxe Python).

Área de terminal que exibe saídas padrão (stdout) capturadas de funções print() executadas pelo usuário.

FR-06: Sandbox Baseada em WebAssembly (Pyodide)

Toda execução do código Python do usuário deve ocorrer no cliente via WebAssembly (Pyodide v0.26+).

O ambiente deve interceptar erros de sintaxe, asserção e execução de forma segura sem requisições de backend.

FR-07: Avaliador de Testes Automatizados (Test Runner)

Cada lição possui uma suíte oculta de testes unitários executados no sandbox.

O sistema deve injetar os testes no escopo do Pyodide e avaliar os retornos das funções do usuário.

Em caso de falha, o sistema deve isolar o erro e disparar uma Dica Socrática baseada no tipo de erro de execução ou asserção falha, ao invés de exibir a resposta pronta.

4. Requisitos Não-Funcionais (NFR)

NFR-01: Performance (Execução Local): A execução do código do usuário e a validação dos testes não devem exceder 1.5 segundos após o download inicial do runtime Pyodide.

NFR-02: Segurança Absoluta: O código do usuário não pode ser enviado para execução em servidores, garantindo imunidade contra ataques de negação de serviço (DoS) e execução remota de código (RCE) em nossa infraestrutura.

NFR-03: Arquitetura Offline-First (MVP): Todo o estado do usuário (progresso, XP, vidas, inventário) deve ser mantido localmente usando LocalStorage com um padrão de armazenamento em memória reativo.

NFR-04: Fidelidade de Áudio Nativa: Efeitos de som (sucesso/erro/cliques) devem ser renderizados dinamicamente usando a Web Audio API nativa do browser para evitar carregar ativos de áudio pesados via rede.

5. Estrutura do Roadmap de Aprendizado (11 Fases)

Fase

Título Técnico

Foco de Conhecimento

Exemplo de Desafio

Fase 1

Fundamentos de Computação

Lógica de programação, variáveis mentais, pseudocódigo

Criar fluxo de saída de texto

Fase 2

Python Básico

Tipos primitivos, operadores, condicionais, loops e funções

Função de detecção de paridade, acumuladores de soma

Fase 3

Python Intermediário

Estruturas de dados nativas (list, dict, tuple, set)

Manipular dicionário e fazer filtragem de chaves

Fase 4

Programação Orientada a Objetos

Classes, herança, encapsulamento, polimorfismo

Implementar uma classe ContaBancária com regras de saque

Fase 5

Estruturas e Algoritmos Avançados

Complexidade de Algoritmos (Big O), Filas, Pilhas, Listas Ligadas

Ordenação otimizada, busca binária recursiva

Fase 6

Controle de Versão

Fluxos de Git, branches, merges, commits e PRs

Simular resolução de conflitos textuais

Fase 7

Bancos de Dados

Linguagem SQL, ORM, manipulação relacional

Consultar e filtrar registros simulando joins

Fase 8

Desenvolvimento Web

Protocolo HTTP, APIs RESTful, FastAPI, Flask

Montar um JSON schema e decodificar tokens JWT

Fase 9

Testes Automatizados

Filosofia de TDD, Pytest, criação de mocks

Escrever testes de unidade para uma API interna

Fase 10

Projetos de Portfólio

Consolidação em projetos reais estruturados

Refatorar um microsserviço monolítico em Python

Fase 11

Preparação Big Tech (Expert)

Resolução de problemas LeetCode Medium/Hard

Algoritmos de Grafos, Programação Dinâmica

6. Critérios de Aceite Globais

O interpretador Pyodide deve ser inicializado assincronamente em segundo plano, sem travar a renderização inicial da interface.

O usuário não pode progredir na árvore se tentar pular nós bloqueados.

Se o usuário estiver com 0 vidas, o botão de "Verificar Desafio" deve ser desabilitado ou redirecionar o usuário à compra de vidas na loja.

Efeitos sonoros e visuais do mascote devem ser síncronos ao feedback de acerto/erro.

7. Changelog de Implementação

Esta seção documenta cronologicamente as iterações de engenharia que construíram o PyLingo do zero.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passo 1 — Base Arquitetural (Vite + React + TypeScript + Tailwind)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arquivos criados: vite.config.ts, tailwind.config.js, src/core/types.ts,
src/core/progression.ts, src/core/lessonsData.ts (Fases 1–2).

Decisões Arquiteturais:
- Princípio "Irrepresentabilidade de Estados Inválidos": HeartsCount
  foi modelado como 0|1|2|3|4|5 (tipo literal union), não number, para
  que o compilador TypeScript rejeite estados inconsistentes em tempo de
  compilação.
- Princípio "Núcleo Funcional & Casca Imperativa": todas as regras de
  negócio (addXp, deductHeart, unlockNextLesson) foram isoladas em
  src/core/progression.ts como funções puras sem efeitos colaterais.
  O estado reativo ficou exclusivamente nos hooks (src/hooks/).
- Persistência Offline-First via LocalStorage encapsulada no hook
  useLocalStorage.ts, respeitando o requisito NFR-03.
- Design por Contrato: cada função pura valida pré-condições e lança
  erros explícitos com mensagens prefixadas "Contrato Violado:".
- Testes unitários: 11 casos em src/core/progression.test.ts validando
  todas as funções do núcleo com Red-Green-Refactor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passo 2 — Animações e Micro-interações (Framer Motion + SVG Mascote)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arquivos criados/modificados: src/components/Mascot.tsx,
src/hooks/useAudio.ts.

Decisões Arquiteturais:
- O mascote (cobra píton SVG) recebe a prop `mood: MascotMood` como
  tipo literal union ('happy'|'sad'|'thinking'|'geek'), garantindo que
  o componente jamais processe estados de humor indefinidos.
- Efeitos sonoros (sucesso, erro, clique) são gerados em tempo real via
  Web Audio API (useAudio.ts) sem carregar ativos de áudio pela rede,
  atendendo ao NFR-04.
- Animações Framer Motion aplicadas nas transições de humor do mascote
  e nas micro-interações de botões (pressionar/soltar).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passo 3/4 — Sandbox Python (Monaco Editor + Pyodide em Web Worker)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arquivos criados/modificados: src/components/MonacoEditor.tsx,
src/core/pyodide.worker.ts, src/hooks/usePyodide.ts,
src/components/ActiveLessonView.tsx.

Decisões Arquiteturais:
- Monaco Editor carregado via React.lazy() + Suspense para não bloquear
  o LCP (Largest Contentful Paint) da aplicação.
- Pyodide (WebAssembly) encapsulado exclusivamente em um Web Worker,
  isolando o runtime Python da thread principal de UI — garantindo que
  código do usuário não trave a interface (NFR-01).
- Mecanismo de Timeout Fail-Fast (5 segundos): o hook usePyodide.ts
  monitora execuções prolongadas, termina o worker bloqueado, resolve a
  Promise com TimeoutError e recria o worker para execuções futuras.
- Execução de testes um a um (assert por assert) com try/except por
  instrução: permite reportar exatamente quantos testes passaram vs.
  falharam e qual assert disparou o erro primeiro.
- Retrocompatibilidade garantida: os campos testsTotal, testsPassed,
  testsFailed e firstFailedMessage são undefined quando testAssertions
  não for fornecido (execução livre).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passo 5 — Banco de Lições (Fases 1–5 em lessonsData.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arquivos modificados: src/core/lessonsData.ts.

Decisões Arquiteturais:
- Cada lição implementa a interface ILesson (tipos.ts), com campos
  obrigatórios: id, phaseTitle, title, difficulty, description,
  instructions, codeSkeleton, testAssertions e hint.
- As asserções de teste (testAssertions) são strings de código Python
  puro injetadas no escopo do worker, nunca expostas ao usuário,
  preservando a integridade dos desafios.
- Fases 1 e 2 completas; Fases 3-5 progressivamente adicionadas com
  desafios de estruturas de dados, OOP e algoritmos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passo 6 — Qualidade Arquitetural (errorTranslator + Terminal Colorido)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Arquivos criados: src/core/errorTranslator.ts,
src/core/errorTranslator.test.ts.
Arquivos modificados: src/components/ActiveLessonView.tsx,
src/core/pyodide.worker.ts, src/hooks/usePyodide.ts.

Decisões Arquiteturais:
- Extração da lógica de tradução de erros para módulo puro isolado
  (errorTranslator.ts), respeitando o princípio "Núcleo Funcional &
  Casca Imperativa". O componente ActiveLessonView não mais contém
  lógica de detecção de padrões de erro.
- translatePythonError cobre 8 categorias de erro Python: TimeoutError,
  AssertionError, NameError, IndentationError, SyntaxError, TypeError
  (com especialização para unsupported operand), RecursionError e
  ZeroDivisionError. Erros desconhecidos delegam ao defaultHint da lição.
- ConsoleOutput extraído como sub-componente puro com colorização
  semântica de linhas: verde (sucesso/✓), vermelho+fundo (Error/
  Traceback/TimeoutError), laranja (AssertionError), slate (print()).
- Contador de testes exibido ao final do terminal:
  "✓ N/M testes passaram" ou "✗ N/M testes falharam".
- Suite de testes expandida: 22 casos totais (11 progression + 11
  errorTranslator) cobrindo todas as categorias e o invariante de
  pureza funcional.