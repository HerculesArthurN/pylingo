<p align="center">
  <img src="https://img.shields.io/badge/PyLingo-v2.0-10B981?style=for-the-badge&logo=python&logoColor=white" alt="PyLingo v2.0" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Pyodide-0.26-306998?style=for-the-badge&logo=python&logoColor=white" alt="Pyodide 0.26" />
</p>

<h1 align="center">🐍 PyLingo</h1>

<p align="center">
  <strong>Aprenda Python de forma gamificada, direto no navegador.</strong>
  <br />
  Sem instalação. Sem configuração. Apenas código.
</p>

---

## 🎯 Sobre o Projeto

**PyLingo** é uma plataforma interativa e gamificada de aprendizado de Python que roda inteiramente no navegador. Utilizando um interpretador Python real via WebAssembly (Pyodide), o aluno escreve, executa e valida código Python em tempo real — sem necessidade de instalar absolutamente nada.

A experiência é inspirada nos melhores aplicativos de aprendizado de idiomas, aplicando mecânicas de gamificação como **XP**, **vidas**, **moedas**, **conquistas desbloqueáveis**, **revisão espaçada (Leitner System)** e **nivelamento progressivo** para manter o engajamento e a retenção de longo prazo.

---

## ✨ Funcionalidades

- 🧠 **Interpretador Python Real no Navegador** — Pyodide (CPython 3.12 compilado para WebAssembly) executa código real, não simulações.
- 📝 **Editor de Código Profissional** — Monaco Editor (o mesmo do VS Code) com syntax highlighting e autocomplete.
- 🎮 **Gamificação Completa** — Sistema de XP, níveis, vidas, moedas e loja virtual.
- 🏆 **Conquistas Desbloqueáveis** — Badges e medalhas por marcos de aprendizado.
- 🔁 **Revisão Espaçada (Leitner System)** — Algoritmo científico de memorização de longo prazo.
- 📊 **Perfil com Gráficos de Progresso** — Visualização do histórico semanal de XP via Recharts.
- ☁️ **Sincronização em Nuvem (Opcional)** — Arquitetura Offline-First com Supabase Auth e Database.
- 🐸 **Mascote Interativo** — Feedback visual animado com Framer Motion.
- 📱 **Design Responsivo** — Interface adaptável para desktop e dispositivos móveis.

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|:---|:---|
| **Frontend** | React 18 + TypeScript 5 (strict mode) |
| **Estilização** | Tailwind CSS 3 |
| **Editor de Código** | Monaco Editor (@monaco-editor/react) |
| **Runtime Python** | Pyodide 0.26.1 (CPython 3.12 via WebAssembly) |
| **Animações** | Framer Motion |
| **Gráficos** | Recharts |
| **Cloud (Opcional)** | Supabase (Auth + PostgreSQL) |
| **Build Tool** | Vite 5 |
| **Testes** | Vitest |

---

## 🚀 Instalação e Execução Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/pylingo.git
cd pylingo

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Comandos Disponíveis

| Comando | Descrição |
|:---|:---|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila o projeto para produção (TypeScript + Vite) |
| `npm run preview` | Pré-visualiza o build de produção localmente |
| `npm run test` | Executa a suíte de testes unitários (Vitest) |
| `npm run lint` | Analisa o código com ESLint |

### Configuração da Nuvem (Opcional)

Para habilitar a sincronização em nuvem, crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-publica
```

> **Nota:** A aplicação funciona perfeitamente sem configuração de nuvem. Todos os dados são salvos localmente no navegador via LocalStorage.

---

## 📁 Estrutura do Projeto

```
pylingo/
├── src/
│   ├── core/           # Lógica de domínio pura (tipos, progressão, gamificação)
│   ├── components/     # Componentes React da interface
│   ├── hooks/          # Custom hooks (Pyodide, áudio, localStorage)
│   ├── App.tsx         # Componente raiz e orquestração de estado
│   └── main.tsx        # Ponto de entrada da aplicação
├── index.html          # Template HTML base
├── package.json        # Dependências e scripts
├── tailwind.config.js  # Configuração do Tailwind CSS
├── tsconfig.json       # Configuração do TypeScript
└── vite.config.ts      # Configuração do Vite
```

---

## 🧪 Testes

O projeto utiliza **Vitest** para testes unitários do núcleo lógico funcional:

```bash
npm run test
```

A suíte cobre: progressão, nivelamento, conquistas, revisão espaçada, perfil, tradução de erros e sincronização em nuvem.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).

---

<p align="center">
  Feito com 💚 e muita gamificação por <strong>Hércules Arthur</strong>
</p>
