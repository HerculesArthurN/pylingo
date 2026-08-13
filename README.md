<p align="center">
  <img src="https://img.shields.io/badge/PyLingo-v2.0-10B981?style=for-the-badge&logo=python&logoColor=white" alt="PyLingo v2.0" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Pyodide-0.26-306998?style=for-the-badge&logo=python&logoColor=white" alt="Pyodide 0.26" />
</p>

<h1 align="center">🐍 PyLingo v2.0</h1>

<p align="center">
  <strong>Plataforma Interativa de Aprendizagem em Python com Jornada Não-Punitiva e Dicas Socráticas.</strong>
  <br />
  Sem instalação. Sem bloqueio por vidas. Apenas prática guiada e código real.
</p>

---

## 🎯 Sobre o Projeto

**PyLingo** é uma plataforma interativa de aprendizagem em Python baseada nas melhores práticas da neurociência da aprendizagem e EdTech. Executando um CPython 3.12 real no navegador via WebAssembly (Pyodide), o estudante escreve e testa código em tempo real com autonomia e embasamento teórico.

A versão **2.0** introduz o **Livro Teórico Interativo** com 12 capítulos estruturados, **132 exercícios práticos**, **Motor de Dicas Socráticas em 3 Níveis** e uma **jornada de aprendizado não-punitiva** (sem bloqueio de corações/vidas).

---

## ✨ Funcionalidades v2.0

- 📖 **Livro Teórico Interativo** — 12 Capítulos com analogias visuais, blocos de código editáveis, callouts e mini-quizzes integrados.
- 💡 **Motor de Dicas Socráticas em 3 Níveis** — Orientação progressiva (Intuição Lógica, Recurso Python e Passo a Passo) sem revelar soluções prontas.
- 🧠 **Interpretador Python Real no Navegador** — CPython 3.12 via WebAssembly (Pyodide) executando código real com segurança.
- 📝 **Editor de Código Profissional** — Monaco Editor (mesmo motor do VS Code) com destaque de sintaxe e autocompletar.
- 🎯 **Jornada Não-Punitiva** — Remoção da trava por perda de vidas/corações. Erros são oportunidades de aprendizado.
- 🏆 **Gamificação Sustentável** — XP, moedas (LingoCoins), Loja Virtual (Passe de Dicas) e Badges desbloqueáveis.
- 🔁 **Revisão Espaçada (Leitner System)** — Algoritmo de memorização ativa de longo prazo.
- ⚡ **Code-Splitting e Performance** — SPA com boot instantâneo (< 1.0 s) e carregamento lazy sob demanda de capítulos e exercícios.
- 📱 **Design Responsivo** — Interface fluida adaptada para telas desktop e mobile.

---

## 📚 Grade Curricular (12 Capítulos / 132 Exercícios)

1. **Primeiros Passos com Python** — `print()`, variáveis, tipos e operadores (12 exerc.)
2. **Entrada e Saída de Dados** — `input()`, casting, f-strings, `.format()` e `:.2f` (10 exerc.)
3. **Operadores e Expressões** — Relacionais, lógicos e expressão ternária inline (10 exerc.)
4. **Condicionais** — `if`, `elif`, `else`, indentação e `match-case` (12 exerc.)
5. **Repetições** — `for`, `while`, `range()`, `break`, `continue` e `enumerate()` (14 exerc.)
6. **Funções** — `def`, parâmetros, `return`, argumentos padrão e `*args` (12 exerc.)
7. **Listas e Tuplas** — Slicing, métodos nativos, imutabilidade e List Comprehension (12 exerc.)
8. **Dicionários e Conjuntos** — Estruturas chave-valor, `.get()`, `.items()`, `set` e operações de conjuntos (10 exerc.)
9. **POO: Classes e Objetos** — `__init__`, `self`, métodos, herança com `super()` e `@property` (12 exerc.)
10. **Algoritmos e Estruturas** — Busca Binária, Bubble Sort, Quick Sort, Pilhas e Filas (10 exerc.)
11. **Tratamento de Erros** — `try/except/finally/else`, `raise` e exceções personalizadas (10 exerc.)
12. **Projeto Integrador** — Projeto guiado MiniGit (Staging, Commit, Log, Checkout, Status e Reset) (8 exerc.)

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|:---|:---|
| **Frontend** | React 18 + TypeScript 5 (strict mode) |
| **Estilização** | Tailwind CSS 3 |
| **Editor de Código** | Monaco Editor (`@monaco-editor/react`) |
| **Runtime Python** | Pyodide 0.26.1 (CPython 3.12 via WASM Worker) |
| **Animações** | Framer Motion |
| **Gráficos** | Recharts |
| **Cloud Sync** | Supabase Auth + Database (Offline-First) |
| **Build Tool** | Vite 5 |
| **Testes** | Vitest (122 testes unitários e de schema) |

---

## 🚀 Instalação e Execução Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pylingo.git
cd pylingo

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará acessível em `http://localhost:5173`.

### Comandos Disponíveis

| Comando | Descrição |
|:---|:---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila o projeto para produção com code-splitting |
| `npm run test` | Executa a suíte completa de testes unitários com Vitest |
| `npm run validate:json` | Valida o schema de todos os 12 capítulos e 132 exercícios |
| `npm run lint` | Executa a verificação estática com ESLint |

---

## 🧪 Testes e Validação de Dados

```bash
npm run test
```

A suíte automatizada cobre:
- Integridade de Schema dos 12 Capítulos e 132 Exercícios (`schemaValidation.test.ts`)
- Motor de Dicas Socráticas em 3 Níveis (`hintEngine.test.ts`)
- Carregamento Lazy / Dynamic Import (`dataLoader.test.ts`)
- Migração Determinística de Estado v1 -> v2 (`migration.test.ts`)
- Progressão, Conquistas, Nivelamento, Perfil, Erros e Sincronização em Nuvem.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

---

<p align="center">
  Feito com 💚 e muita gamificação por <strong>Hércules Arthur</strong>
</p>
