<p align="center">
  <img src="https://img.shields.io/badge/PyLingo-v2.0-10B981?style=for-the-badge&logo=python&logoColor=white" alt="PyLingo v2.0" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Pyodide-0.26-306998?style=for-the-badge&logo=python&logoColor=white" alt="Pyodide 0.26" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 3.4" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Sync-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-blue?style=for-the-badge" alt="WCAG 2.2 AA" />
</p>

<h1 align="center">🐍 PyLingo</h1>

<p align="center">
  <strong>Plataforma Gamificada e Interativa para Aprendizagem Profunda de Python com Execução Local via WebAssembly.</strong>
  <br />
  Sem instalação de compiladores ou terminais locais. Sem barreiras punitivas de vidas. Apenas código real, livro interativo e aprendizagem orientada por dicas socráticas.
</p>

---

## 📖 Visão Geral

O **PyLingo** é uma Single Page Application (SPA) educacional de alta performance projetada para guiar qualquer pessoa — desde o iniciante sem qualquer base em computação até o desenvolvedor focado em entrevistas técnicas — rumo à maestria em Python.

Combinando o poder do **WebAssembly (Pyodide)** com as melhores práticas de design de produto e pedagogia ativa, o PyLingo roda um ambiente **CPython 3.12 real dentro de um Web Worker no navegador**, garantindo segurança, privacidade, velocidade e operação 100% offline-first.

### 🎯 Diferenciais Pedagógicos e Técnicos:
- **Zero Instalação:** O estudante abre a plataforma e programa imediatamente em Python com realimentação instantânea de stdout/stderr.
- **Aprendizado Não-Punitivo:** Modelo pedagógico humanizado que substituiu o bloqueio tradicional por "vidas/corações" pelo **Motor de Dicas Socráticas em 3 Níveis**.
- **Livro Teórico Integrado:** 12 capítulos estruturados com analogias do dia a dia, callouts informativos, código editável em tempo real e mini-quizzes conceituais.
- **Sistema de Repetição Espaçada (Leitner SRS):** Revisão contínua e inteligente dos conceitos para consolidação do conhecimento na memória de longo prazo.
- **Sincronização em Nuvem Híbrida (Supabase):** Funciona perfeitamente offline via `localStorage` e permite autenticação e backup contínuo do progresso em nuvem.

---

## ✨ Status das Funcionalidades (Feature Matrix)

| Funcionalidade | Status | Detalhes Técnicos |
|:---|:---:|:---|
| **Livro Interativo (12 Capítulos)** | ✅ Concluído | 12 capítulos didáticos com analogias visuais, código executável e quizzes |
| **Bateria de Exercícios (132 Desafios)** | ✅ Concluído | Suítes de testes unitários isoladas, validação de schema estrita via Vitest |
| **Motor de Dicas Socráticas (3 Níveis)** | ✅ Concluído | Nível 1 (Intuição), Nível 2 (Recurso Python), Nível 3 (Passo a Passo com dedução) |
| **Runtime Pyodide em Web Worker** | ✅ Concluído | CPython 3.12 em WebAssembly com timeout fail-fast (5s) e isolamento da thread principal |
| **Editor Profissional Monaco** | ✅ Concluído | Engine do VS Code com auto-complete, realce de sintaxe, indentação e atalhos |
| **Terminal Semântico Colorizado** | ✅ Concluído | Saída formatada para prints (`stdout`), exceções traduzidas e placar de asserções |
| **Tradutor de Erros Python** | ✅ Concluído | Tradução pedagógica de `SyntaxError`, `NameError`, `TypeError`, `IndentationError`, etc. |
| **Sistema de Repetição Espaçada (SRS)** | ✅ Concluído | 5 caixas Leitner com agendamento temporal (1d, 3d, 7d, 14d, 30d) |
| **Gamificação Sustentável** | ✅ Concluído | XP, Níveis, LingoCoins, Ofensiva (Streak) e Fila Sequencial (FIFO) de Modais |
| **Sistema de Conquistas** | ✅ Concluído | Conquistas desbloqueáveis baseadas em XP, ofensiva, capítulos lidos e desafios |
| **Perfil e Análise de Desempenho** | ✅ Concluído | Gráficos de evolução de XP diário via Recharts, métricas e histórico |
| **Loja de Itens Virtuais** | ✅ Concluído | Itens cosméticos para o Mascote, Passe de Dicas e Congelamento de Streak |
| **Mascote SVG Reativo (Lingo)** | ✅ Concluído | Estados emocionais reativos (`happy`, `thinking`, `sad`, `geek`) e micro-animações |
| **Sandbox de Código Livre** | ✅ Concluído | Ambiente de experimentação e escrita de scripts Python sem restrições |
| **Onboarding & Tour Guiado** | ✅ Concluído | Apresentação passo a passo com interatividade para novos usuários |
| **Sincronização em Nuvem (Supabase)** | ✅ Concluído | Auth por Email/Senha, mesclagem bidirecional de estado e backup seguro |
| **Acessibilidade & Temas** | ✅ Concluído | Conformidade WCAG 2.2 AA, navegação por teclado, temas Claro e Escuro |

---

## 📚 Grade Curricular Completa

O currículo do PyLingo é composto por **12 Capítulos Teóricos** e **132 Exercícios Práticos**:

```
[Cap. 01: Primeiros Passos] ──► [Cap. 02: Entrada & Saída] ──► [Cap. 03: Operadores & Expressões]
                                                                          │
┌─────────────────────────────────────────────────────────────────────────┘
▼
[Cap. 04: Estruturas Condicionais] ──► [Cap. 05: Laços de Repetição] ──► [Cap. 06: Funções & Escopo]
                                                                                  │
┌─────────────────────────────────────────────────────────────────────────────────┘
▼
[Cap. 07: Listas & Tuplas] ──► [Cap. 08: Dicionários & Sets] ──► [Cap. 09: Programação a Objetos]
                                                                          │
┌─────────────────────────────────────────────────────────────────────────┘
▼
[Cap. 10: Algoritmos & Estruturas] ──► [Cap. 11: Tratamento de Exceções] ──► [Cap. 12: MiniGit Integrador]
```

| Cap. | Título | Conceitos Centrais | Exercícios |
|:---:|:---|:---|:---:|
| **01** | **Primeiros Passos** | `print()`, variáveis, tipos primitivos (`int`, `float`, `str`, `bool`) e operadores aritméticos | 12 |
| **02** | **Entrada e Saída** | `input()`, conversão de tipos (casting), f-strings e formatação numérica | 10 |
| **03** | **Operadores e Expressões** | Operadores relacionais (`==`, `!=`, `<`, `>`), lógicos (`and`, `or`, `not`) e ternário inline | 10 |
| **04** | **Estruturas Condicionais** | `if`, `elif`, `else`, blocos aninhados, operadores de pertinência (`in`) e `match-case` | 12 |
| **05** | **Laços de Repetição** | `for`, `while`, `range()`, `break`, `continue`, `enumerate()` e `zip()` | 14 |
| **06** | **Funções e Escopo** | Definição com `def`, parâmetros posicionais, nomeados, `*args`, `**kwargs` e retorno com `return` | 12 |
| **07** | **Listas e Tuplas** | Indexação, fatiamento (*slicing*), métodos de mutação (`append`, `pop`, `sort`) e List Comprehensions | 12 |
| **08** | **Dicionários e Conjuntos** | Chave-valor, métodos `.get()`, `.items()`, `.keys()`, `set`, união, interseção e diferença | 10 |
| **09** | **Programação Orientada a Objetos** | Classes, métodos, `__init__`, `self`, encapsulamento, herança com `super()` e `@property` | 12 |
| **10** | **Algoritmos e Estruturas de Dados** | Busca Linear e Binária, Bubble Sort, Quick Sort, Pilhas (Stack) e Filas (Queue) | 10 |
| **11** | **Tratamento de Exceções** | `try`, `except`, `finally`, `else`, lançamento de exceções com `raise` e erros personalizados | 10 |
| **12** | **Projeto Integrador (MiniGit)** | Implementação completa de um mini sistema de controle de versão (Init, Hash, Stage, Commit, Log) | 8 |

---

## 🛠️ Stack Tecnológica & Dependências

```
                        ┌─────────────────────────────────────────┐
                        │          Camada de Apresentação         │
                        │   React 18  •  TypeScript 5  •  Vite 5 │
                        │  Tailwind CSS 3.4  •  Lucide Icons      │
                        └────────────────────┬────────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Editor & Interface    │     │   Runtime de Execução   │     │  Persistência & Dados   │
│  Monaco Code Editor     │     │  Pyodide 0.26 (CPython) │     │  LocalStorage Resiliente│
│  Recharts (Métricas XP) │     │  Web Worker Isolado     │     │  Supabase Cloud Client  │
│  Web Audio API Synth    │     │  Test Runner Integrado  │     │  DataLoader Dinâmico    │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

### Principais Dependências:
- **`react` & `react-dom` (^18.3.1):** Renderização reativa e componentes de interface.
- **`@monaco-editor/react` (^4.7.0):** Editor de código padrão da indústria.
- **`lucide-react` (^0.395.0):** Conjunto abrangente e consistente de ícones vetoriais.
- **`recharts` (^3.9.2):** Visualização gráfica da progressão de XP e métricas do perfil.
- **`@supabase/supabase-js` (^2.110.6):** Autenticação e sincronização com banco relacional em nuvem.
- **`clsx` & `tailwind-merge`:** Utilitários de composição segura de classes CSS dinâmicas.
- **`tailwindcss` (^3.4.4):** Estilização biomórfica de alto contraste e transições fluidas.
- **`vitest` (^1.6.0):** Framework de testes unitários ultrarrápido com Hot Module Replacement.

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- **Node.js:** Versão 18.x ou 20.x LTS recomendada.
- **npm:** Versão 9.x ou superior.
- **Navegador Moderno:** Chrome, Firefox, Edge, Safari ou Brave com suporte a WebAssembly e Web Workers.

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/pylingo.git
cd pylingo
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente (Opcional)
Por padrão, o PyLingo opera em **modo 100% autônomo offline-first** utilizando `localStorage`. Se desejar habilitar autenticação e sincronização em nuvem com Supabase:

```bash
# Copie o modelo de variáveis de ambiente
cp .env.example .env.local
```

Edite o arquivo `.env.local`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação em [http://localhost:5173](http://localhost:5173).

---

## 📜 Scripts do Projeto

| Comando | Descrição |
|:---|:---|
| `npm run dev` | Inicia o servidor Vite de desenvolvimento com Hot Reloading |
| `npm run build` | Valida tipagem com TypeScript (`tsc`) e gera o bundle de produção otimizado |
| `npm run preview` | Executa servidor local para inspecionar os arquivos da pasta `/dist` |
| `npm run test` | Executa a suíte completa de testes unitários com Vitest |
| `npm run validate:json` | Valida especificamente os schemas JSON dos 12 capítulos e 132 exercícios |
| `npm run lint` | Executa o ESLint para assegurar padrões de código TypeScript/React |

---

## 🧪 Cobertura de Testes Automatizados

A estabilidade do PyLingo é assegurada por **122+ testes unitários automatizados** distribuídos em 11 suítes de teste:

```bash
npm run test
```

### Suítes Testadas:
1. `src/core/schemaValidation.test.ts`: Integridade de 100% dos JSONs de capítulos e exercícios.
2. `src/core/hintEngine.test.ts`: Dedução de recompensas, cálculo de XP e consumo de Hint Passes.
3. `src/core/spacedRepetition.test.ts`: Algoritmo de intervalos Leitner e transição de caixas 1 a 5.
4. `src/core/leveling.test.ts`: Fórmula de XP, curvas de nível e detecção de level up.
5. `src/core/progression.test.ts`: Funções puras de transição de estado, moedas e ofensiva.
6. `src/core/profile.test.ts`: Agrupamento de histórico diário de XP e cálculos de estatísticas.
7. `src/core/errorTranslator.test.ts`: Tradução pedagógica das 8 categorias de exceções Python.
8. `src/core/achievements.test.ts`: Critérios de desbloqueio de insígnias e recompensas.
9. `src/core/cloud.test.ts`: Mesclagem inteligente de estado e resolução de conflitos (local vs cloud).
10. `src/core/migration.test.ts`: Migração determinística de dados da versão v1 (com vidas) para v2.
11. `src/core/dataLoader.test.ts`: Carregamento assíncrono e validação de cache em memória.

---

## 🔒 Segurança e Privacidade

- **Isolamento Total:** Todo o código Python executado roda no sandbox WebAssembly do cliente. Nenhum código de usuário é transmitido para servidores remotos para compilação.
- **Proteção contra DoS e RCE:** Imunidade a ataques de execução remota em infraestrutura de terceiros.
- **Timeout Proativo:** Proteção contra travamentos da máquina do usuário através de encerramento compulsório de Workers em execuções superiores a 5 segundos.

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [MIT](LICENSE).

---

<p align="center">
  Desenvolvido com 💚 por <strong>Hercules Nardelli</strong>
</p>
