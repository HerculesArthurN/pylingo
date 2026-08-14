<p align="center">
  <img src="https://img.shields.io/badge/PyLingo-v2.0-10B981?style=for-the-badge&logo=python&logoColor=white" alt="PyLingo v2.0" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Pyodide-0.26-306998?style=for-the-badge&logo=python&logoColor=white" alt="Pyodide 0.26" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-blue?style=for-the-badge" alt="WCAG 2.2 AA" />
</p>

<h1 align="center">🐍 PyLingo</h1>

<p align="center">
  <strong>Plataforma Interativa e Gamificada para Aprendizagem em Python com Execução Local via WebAssembly.</strong>
  <br />
  Sem necessidade de instalação de interpretadores. Sem bloqueios punitivos de vidas. Apenas código real e aprendizado guiado.
</p>

---

## 📖 Visão Geral

O **PyLingo** é uma plataforma educacional interativa projetada para transformar o aprendizado da linguagem Python em uma experiência imersiva, autônoma e pedagogicamente fundamentada. Utilizando o poder do **WebAssembly (Pyodide)**, a aplicação executa um CPython 3.12 real diretamente no navegador do estudante, eliminando barreiras de configuração de ambiente e garantindo execução segura e instantânea.

### Problemas que o PyLingo resolve:
- **Atrito inicial de configuração:** Não é necessário instalar Python, gerenciar `venv` ou configurar compiladores na máquina do usuário.
- **Frustração com modelos punitivos:** Diferente de apps com travas de "corações/vidas" que impedem o estudo ao errar, o PyLingo adota uma jornada não-punitiva com **dicas socráticas progressivas** em 3 níveis.
- **Falta de retenção de conhecimento:** Integração com o algoritmo de repetição espaçada (Sistema de Leitner) para fixação de longo prazo dos conceitos aprendidos.

### Público-Alvo:
- Iniciantes absolutos em programação e estudantes autodidatas.
- Desenvolvedores em transição de carreira buscando proficiência em Python.
- Educadores e instituições de ensino que necessitam de um ambiente prático e padronizado para exercícios de código.

---

## ✨ Funcionalidades Principais

- 📖 **Livro Teórico Interativo (12 Capítulos):** Explicações estruturadas com analogias visuais, blocos de código editáveis e mini-quizzes integrados.
- 💡 **Motor de Dicas Socráticas em 3 Níveis:** Orientação progressiva (1. Intuição Lógica, 2. Recurso Python, 3. Passo a Passo estruturado) sem entregar a resposta final de bandeja.
- 🧠 **CPython 3.12 no Navegador:** Runtime Python completo via WebAssembly isolado em Web Worker, garantindo que a UI permaneça responsiva durante a execução.
- 📝 **Editor Profissional Monaco:** A mesma engine do VS Code com realce de sintaxe, indentação automática e autocompletar.
- 🎯 **Gamificação Sustentável:** XP diário, moedas virtuais (LingoCoins), conquistas desbloqueáveis e histórico de ofensiva (streak).
- 🔁 **Revisão Espaçada (Leitner System):** Agendamento inteligente para revisão periódica de conceitos desafiadores.
- ♿ **Acessibilidade Completa (WCAG 2.2 AA):** Suporte integral a navegação por teclado, temas de alto contraste e conformidade semântica para leitores de tela.
- 🔒 **Arquitetura Offline-First Resiliente:** Funcionamento 100% autônomo no cliente, com sincronização em nuvem opcional via Supabase.

---

## 📚 Grade Curricular

| Capítulo | Tópicos Centrais | Exercícios |
|:---:|:---|:---:|
| **01** | **Primeiros Passos:** `print()`, variáveis, tipos primitivos e operadores | 12 |
| **02** | **Entrada e Saída:** `input()`, casting de tipos, f-strings e formatação numérica | 10 |
| **03** | **Operadores e Expressões:** Relacionais, lógicos e operador ternário inline | 10 |
| **04** | **Estruturas Condicionais:** `if`, `elif`, `else`, blocos aninhados e `match-case` | 12 |
| **05** | **Laços de Repetição:** `for`, `while`, `range()`, `break`, `continue` e `enumerate()` | 14 |
| **06** | **Funções e Escopo:** `def`, parâmetros, retorno, valores padrão e `*args` | 12 |
| **07** | **Listas e Tuplas:** Fatiamento (slicing), métodos nativos e List Comprehensions | 12 |
| **08** | **Dicionários e Conjuntos:** Estruturas chave-valor, `.get()`, `.items()`, `set` e uniões | 10 |
| **09** | **Programação Orientada a Objetos:** Classes, `__init__`, `self`, herança com `super()` e `@property` | 12 |
| **10** | **Algoritmos e Estruturas de Dados:** Busca Binária, Bubble Sort, Quick Sort, Pilhas e Filas | 10 |
| **11** | **Tratamento de Exceções:** `try/except/finally/else`, `raise` e classes de erro customizadas | 10 |
| **12** | **Projeto Integrador (MiniGit):** Implementação de um clone didático do Git (Staging, Commit, Log, Status) | 8 |

---

## 🛠️ Tech Stack

| Camada | Tecnologia | Finalidade |
|:---|:---|:---|
| **Core UI** | React 18 + TypeScript 5 (Strict Mode) | Interface reativa e fortemente tipada |
| **Estilização** | Tailwind CSS 3 | Design system biomórfico e responsivo |
| **Editor de Código** | Monaco Editor (`@monaco-editor/react`) | Ambiente de desenvolvimento in-browser |
| **Runtime Python** | Pyodide 0.26.1 (CPython 3.12 WASM) | Execução segura isolada em Web Worker |
| **Animações** | Framer Motion | Micro-interações e transições fluidas |
| **Visualização de Dados**| Recharts | Gráficos de evolução de XP e métricas de estudo |
| **Sincronização** | Supabase JS Client | Autenticação e persistência em nuvem (opcional) |
| **Build & Tooling** | Vite 5 | Bundler ultrarrápido com Hot Module Replacement |
| **Testes Automatizados**| Vitest | Suíte de testes unitários e validação de schema |

---

## 🏗️ Arquitetura de Alto Nível

```
┌───────────────────────────────────────────────────────────────┐
│                       Navegador do Usuário                    │
│                                                               │
│  ┌───────────────────────┐         ┌────────────────────────┐ │
│  │   Interface React     │         │   Monaco Code Editor   │ │
│  │ (Componentes & Views) ├─────────┤   (Edição & Atalhos)   │ │
│  └───────────┬───────────┘         └───────────┬────────────┘ │
│              │                                 │              │
│              ▼                                 ▼              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                Pyodide WASM Web Worker                   │ │
│  │   - CPython 3.12 Runtime                                 │ │
│  │   - Captura e Redirecionamento de stdout/stderr          │ │
│  │   - Validador Automatizado de Assertions                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│              ▲                                                │
│              │                                                │
│  ┌───────────┴───────────┐         ┌────────────────────────┐ │
│  │  LocalStorage Seguro  │         │  Supabase Cloud Sync   │ │
│  │  (Cache Offline-First)│ ◄─────► │  (Sincronização Opc.)  │ │
│  └───────────────────────┘         └────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
```

- **Isolamento de Execução:** O código Python digitado pelo estudante roda dentro de um Web Worker dedicado, impedindo travamentos na thread de renderização da UI e garantindo sandbox local.
- **Filosofia Offline-First:** Toda a progressão, capítulos, exercícios e conquistas funcionam 100% offline via LocalStorage. A integração com backend Supabase é ativada de forma transparente caso as variáveis de ambiente sejam fornecidas.

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina de desenvolvimento:
- **Node.js:** Versão 18.x ou superior (LTS recomendada).
- **npm:** Versão 9.x ou superior (ou `pnpm` / `yarn`).
- **Navegador Moderno:** Chrome, Edge, Firefox ou Safari com suporte a WebAssembly e Web Workers.

---

## 🚀 Instalação e Configuração

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
O projeto funciona em modo local/offline por padrão. Para habilitar sincronização em nuvem com Supabase:

```bash
# Crie o seu arquivo de configuração a partir do template seguro
cp .env.example .env.local
```

Abra o arquivo `.env.local` e preencha as variáveis com as credenciais do seu projeto Supabase:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 💻 Execução e Scripts Disponíveis

| Comando | Descrição |
|:---|:---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite (`http://localhost:5173`) |
| `npm run build` | Compila o bundle de produção otimizado com TypeScript e Vite |
| `npm run preview` | Executa um servidor local para inspecionar a build de produção |
| `npm run test` | Executa a suíte de testes unitários com Vitest |
| `npm run validate:json` | Valida a integridade e schemas de todos os 12 capítulos e 132 exercícios |
| `npm run lint` | Executa o linter estático ESLint para TypeScript e React |

---

## 🧪 Testes Automatizados

A cobertura de testes automatizados valida componentes críticos de lógica e integridade de dados:

```bash
npm run test
```

A suíte cobre:
- **Validação de Schema:** Integridade estrutural de todos os 12 capítulos e 132 exercícios didáticos.
- **Motor de Dicas Socráticas:** Lógica de progressão das dicas em 3 camadas e mitigação de spoiler.
- **Sistema de Repetição Espaçada:** Algoritmo de agendamento e transição de caixas Leitner.
- **Gamificação & Leveling:** Curva de experiência (XP), cálculo de níveis e desbloqueio de conquistas.
- **Resiliência de Estado e Migração:** Migração determinística de versões e mesclagem de progresso nuvem/local.

---

## 🤝 Como Contribuir

Contribuições são muito bem-vindas! Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes detalhadas sobre padrões de código, testes e fluxo de trabalho para submissão de Pull Requests.

---

## 📄 Licença

Este projeto é software livre distribuído sob os termos da [Licença MIT](LICENSE).

---

<p align="center">
  Desenvolvido por <strong>Hercules Nardelli</strong>
</p>
