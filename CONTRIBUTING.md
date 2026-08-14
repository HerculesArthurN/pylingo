# Diretrizes de Contribuição — PyLingo 🐍

Agradecemos o seu interesse em contribuir com o **PyLingo**! Este documento descreve as diretrizes para propor melhorias, reportar bugs e submeter Pull Requests.

---

## 🧭 Princípios do Projeto

1. **Inclusão e Acessibilidade (WCAG 2.2 AA):** Todo componente de UI deve ser operável por teclado e compatível com leitores de tela.
2. **Jornada Não-Punitiva:** O aprendizado não pune com bloqueio de vidas. Dicas devem seguir a abordagem pedagógica socrática em 3 níveis.
3. **Resiliência Offline-First:** A aplicação deve funcionar 100% de forma local no navegador via WebAssembly (Pyodide), com sincronização em nuvem opcional.
4. **Segurança e Privacidade (DevSecOps):** Nenhuma credencial ou dado sensível deve ser comitado.

---

## 🛠️ Como Contribuir

### 1. Preparando o Ambiente

1. Faça um **Fork** do repositório.
2. Clone o seu fork localmente:
   ```bash
   git clone https://github.com/seu-usuario/pylingo.git
   cd pylingo
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie uma branch para a sua feature ou correção:
   ```bash
   git checkout -b feature/minha-melhoria
   ```

### 2. Padrões de Código e Validação

Antes de abrir um Pull Request, certifique-se de validar:

```bash
# Executar a verificação estática (ESLint)
npm run lint

# Executar a suíte de testes unitários e de integração (Vitest)
npm run test

# Validar o schema dos 12 capítulos e 132 exercícios
npm run validate:json
```

### 3. Convenção de Commits

Utilizamos o padrão de **Conventional Commits**:
- `feat:` Nova funcionalidade ou recurso pedagógico
- `fix:` Correção de bug ou ajuste de comportamento
- `docs:` Atualização ou adição de documentação pública
- `test:` Inclusão ou refatoração de testes automatizados
- `refactor:` Melhoria na estrutura do código sem alteração funcional
- `style:` Ajustes cosméticos de formatação ou estilo

### 4. Enviando o Pull Request

1. Faça o push para a sua branch:
   ```bash
   git push origin feature/minha-melhoria
   ```
2. Abra um **Pull Request** detalhando:
   - O que foi alterado e a motivação.
   - Testes manuais e automatizados realizados.
   - Capturas de tela (se houver alteração visual).

---

## 🛡️ Reportando Vulnerabilidades

Se você identificar uma vulnerabilidade de segurança, por favor envie um reporte responsável diretamente aos mantenedores através de canais privados antes de abrir issues públicas.
