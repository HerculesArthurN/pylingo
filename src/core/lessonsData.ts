import { ILesson } from './types';

export const LESSONS_DATABASE: ILesson[] = [
  // --- FASE 1: FUNDAMENTOS DE COMPUTAÇÃO ---
  {
    id: 'f1_l1',
    phase: 1,
    phaseTitle: 'Fundamentos de Computação',
    title: 'O Primeiro Print',
    icon: 'BookOpen',
    difficulty: 'Fácil',
    description: 'A saída padrão é a forma que os programas se comunicam com o mundo. Em Python, usamos a função print() para exibir mensagens na tela. A mensagem deve estar entre aspas duplas ou simples.',
    instructions: 'Use a instrução print() para exibir exatamente a mensagem: "Olá, Mundo!"',
    codeSkeleton: '# Escreva seu código abaixo\n',
    testAssertions: `
# Suíte de Testes PyLingo
import sys
output = sys.stdout.getvalue().strip()
assert "Olá, Mundo!" in output, f"Esperado 'Olá, Mundo!', mas o console recebeu: '{output}'"
`,
    hint: 'Lembre-se de usar aspas duplas "Olá, Mundo!" e colocar exatamente a grafia correta dentro do print().'
  },
  {
    id: 'f1_l2',
    phase: 1,
    phaseTitle: 'Fundamentos de Computação',
    title: 'Comentários em Python',
    icon: 'BookOpen',
    difficulty: 'Fácil',
    description: 'Comentários ajudam programadores a documentar o código. Em Python, iniciamos comentários usando a hashtag (#). O computador ignora completamente tudo escrito após a hashtag na mesma linha.',
    instructions: 'Escreva um comentário iniciando com "#" na primeira linha com a palavra "Instrução" e, na linha seguinte, exiba a mensagem: "Código Comentado" usando o print().',
    codeSkeleton: '# Adicione seu comentário abaixo\n',
    testAssertions: `
# Suíte de Testes PyLingo
import sys
output = sys.stdout.getvalue().strip()
assert "Código Comentado" in output, f"Você deve exibir exatamente 'Código Comentado'. Recebido: '{output}'"
`,
    hint: 'A primeira linha deve conter # Instrução e a segunda print("Código Comentado").'
  },

  // --- FASE 2: PYTHON BÁSICO ---
  {
    id: 'f2_l1',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Variáveis Numéricas',
    icon: 'Code2',
    difficulty: 'Fácil',
    description: 'Variáveis guardam dados temporariamente na memória ram. Em Python, declaramos uma variável dando um nome a ela e usando o sinal de igual (=) para atribuir um valor numérico inteiro.',
    instructions: 'Crie uma variável chamada "resposta" e atribua a ela o valor inteiro 42.',
    codeSkeleton: '# Crie a variável resposta abaixo\n',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'resposta' in locals(), "Você não definiu a variável 'resposta'."
assert resposta == 42, f"A variável 'resposta' deve ser igual a 42, você definiu como {resposta}."
`,
    hint: 'Escreva: resposta = 42 sem aspas, pois 42 é um número inteiro!'
  },
  {
    id: 'f2_l2',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Variáveis de Texto (Strings)',
    icon: 'Code2',
    difficulty: 'Fácil',
    description: 'Textos na programação são chamados de Strings. Para declarar uma string, cerque o texto com aspas simples ou duplas. Isso informa ao interpretador que o dado não é um comando ou número.',
    instructions: 'Crie uma variável chamada "mascote" e atribua a ela o valor textual "Lingo".',
    codeSkeleton: '# Crie a variável mascote abaixo\n',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'mascote' in locals(), "Você não definiu a variável 'mascote'."
assert mascote == "Lingo", f"A variável 'mascote' deve conter exatamente o texto 'Lingo', você definiu como '{mascote}'."
`,
    hint: 'Escreva: mascote = "Lingo" (com a letra L maiúscula).'
  },
  {
    id: 'f2_l3',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Operadores Matemáticos',
    icon: 'Code2',
    difficulty: 'Fácil',
    description: 'Podemos realizar cálculos matemáticos com os operadores: soma (+), subtração (-), multiplicação (*) e divisão (/). Podemos somar números diretamente e salvar o resultado numa variável.',
    instructions: 'Crie uma variável chamada "soma" que armazena o resultado da soma de 15 com 27.',
    codeSkeleton: '# Calcule a soma de 15 e 27 abaixo\n',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'soma' in locals(), "Você não definiu a variável 'soma'."
assert soma == 42, f"A variável 'soma' deve ser igual a 42 (15 + 27), você definiu como {soma}."
`,
    hint: 'Escreva: soma = 15 + 27'
  },
  {
    id: 'f2_l4',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Tomada de Decisão (if/else)',
    icon: 'Code2',
    difficulty: 'Médio',
    description: 'Estruturas condicionais (if/else) permitem ao computador tomar decisões. O bloco if executa se a condição for verdadeira. A palavra else executa caso contrário. Lembre-se dos dois pontos (:) no fim da condição e de dar o recuo de 4 espaços (indentação) na linha seguinte.',
    instructions: 'Crie uma função chamada "verificar_idade" que recebe um parâmetro "idade". Se a idade for maior ou igual a 18, retorne "Maior de Idade". Caso contrário, retorne "Menor de Idade".',
    codeSkeleton: 'def verificar_idade(idade):\n    # Escreva sua condicional if/else abaixo\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'verificar_idade' in locals(), "A função 'verificar_idade' não foi encontrada."
assert verificar_idade(20) == "Maior de Idade", f"verificar_idade(20) deveria retornar 'Maior de Idade', mas retornou '{verificar_idade(20)}'."
assert verificar_idade(15) == "Menor de Idade", f"verificar_idade(15) deveria retornar 'Menor de Idade', mas retornou '{verificar_idade(15)}'."
`,
    hint: 'Use a estrutura:\nif idade >= 18:\n    return "Maior de Idade"\nelse:\n    return "Menor de Idade"'
  },
  {
    id: 'f2_l5',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Loops de Repetição (for)',
    icon: 'Code2',
    difficulty: 'Difícil',
    description: 'Loops for são usados para repetir instruções uma quantidade específica de vezes. Podemos usar range(1, n + 1) para gerar números sequenciais e acumulá-los em uma variável de controle.',
    instructions: 'Crie uma função "somar_intervalo" que recebe um número inteiro "n" e retorna a soma acumulada de todos os números inteiros positivos de 1 até n usando um loop for.',
    codeSkeleton: 'def somar_intervalo(n):\n    # Use um loop for para acumular a soma\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'somar_intervalo' in locals(), "A função 'somar_intervalo' não foi encontrada."
assert somar_intervalo(5) == 15, f"somar_intervalo(5) deveria ser 15 (1+2+3+4+5), mas retornou {somar_intervalo(5)}."
assert somar_intervalo(1) == 1, f"somar_intervalo(1) deveria ser 1, mas retornou {somar_intervalo(1)}."
`,
    hint: 'Inicie um acumulador em 0 (ex: total = 0), depois use for i in range(1, n + 1): total += i, e retorne o total.'
  },

  // --- FASE 3: PYTHON INTERMEDIÁRIO ---
  {
    id: 'f3_l1',
    phase: 3,
    phaseTitle: 'Python Intermediário',
    title: 'Listas: Criar e Acessar',
    icon: 'List',
    difficulty: 'Fácil',
    description: 'Listas são coleções ordenadas e mutáveis de elementos em Python. Você cria uma lista usando colchetes: `frutas = ["maçã", "banana", "uva"]`. Cada elemento tem um índice começando em 0, então `frutas[0]` retorna `"maçã"`. A função `len()` retorna o número de elementos da lista.',
    instructions: 'Crie uma variável chamada "notas" contendo a lista [7.5, 8.0, 9.5, 6.0, 10.0]. Em seguida, crie "primeira_nota" com o primeiro elemento, "ultima_nota" com o último elemento e "total_notas" com a quantidade de elementos da lista.',
    codeSkeleton: '# Crie a lista e acesse seus elementos abaixo\nnotas = []\nfirst_nota = None\nultima_nota = None\ntotal_notas = None',
    testAssertions: `
# Suíte de Testes PyLingo - f3_l1
assert 'notas' in locals(), "Você não definiu a variável 'notas'."
assert isinstance(notas, list), f"A variável 'notas' deve ser uma lista, mas é do tipo {type(notas).__name__}."
assert notas == [7.5, 8.0, 9.5, 6.0, 10.0], f"A lista 'notas' deve conter [7.5, 8.0, 9.5, 6.0, 10.0], mas contém {notas}."
assert 'primeira_nota' in locals(), "Você não definiu a variável 'primeira_nota'."
assert primeira_nota == 7.5, f"'primeira_nota' deve ser 7.5 (índice 0), mas é {primeira_nota}."
assert 'ultima_nota' in locals(), "Você não definiu a variável 'ultima_nota'."
assert ultima_nota == 10.0, f"'ultima_nota' deve ser 10.0 (último elemento), mas é {ultima_nota}."
assert 'total_notas' in locals(), "Você não definiu a variável 'total_notas'."
assert total_notas == 5, f"'total_notas' deve ser 5 (len da lista), mas é {total_notas}."
`,
    hint: 'Use notas[0] para o primeiro elemento e notas[-1] ou notas[4] para o último. A função len(notas) retorna o total de elementos.'
  },
  {
    id: 'f3_l2',
    phase: 3,
    phaseTitle: 'Python Intermediário',
    title: 'Métodos de Listas',
    icon: 'List',
    difficulty: 'Médio',
    description: 'Listas em Python possuem métodos nativos poderosos: `append(x)` adiciona um elemento ao final; `remove(x)` remove a primeira ocorrência do elemento `x`; `sort()` ordena a lista em ordem crescente (modifica in-place); `reverse()` inverte a ordem da lista (modifica in-place). Esses métodos alteram a lista original.',
    instructions: 'Crie uma função chamada "processar_lista" que recebe uma lista de inteiros. A função deve: (1) adicionar o número 99 ao final, (2) remover o número 0 se ele estiver na lista, (3) ordenar a lista em ordem crescente, e (4) retornar a lista modificada.',
    codeSkeleton: 'def processar_lista(numeros):\n    # 1. Adicione 99 ao final\n    # 2. Remova o 0 (se existir)\n    # 3. Ordene a lista\n    # 4. Retorne a lista\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - f3_l2
assert 'processar_lista' in locals(), "A função 'processar_lista' não foi encontrada."
resultado1 = processar_lista([3, 1, 0, 4, 2])
assert isinstance(resultado1, list), f"A função deve retornar uma lista, mas retornou {type(resultado1).__name__}."
assert 99 in resultado1, f"O número 99 deve estar na lista resultante, mas o resultado foi {resultado1}."
assert 0 not in resultado1, f"O número 0 deve ser removido da lista, mas ainda está presente em {resultado1}."
assert resultado1 == sorted(resultado1), f"A lista deve estar em ordem crescente, mas ficou {resultado1}."
resultado2 = processar_lista([5, 10, 3])
assert resultado2 == [3, 5, 10, 99], f"processar_lista([5, 10, 3]) deveria retornar [3, 5, 10, 99], mas retornou {resultado2}."
`,
    hint: 'Use numeros.append(99) para adicionar, depois verifique "if 0 in numeros" antes de numeros.remove(0), e por fim numeros.sort() antes de retornar.'
  },
  {
    id: 'f3_l3',
    phase: 3,
    phaseTitle: 'Python Intermediário',
    title: 'Dicionários',
    icon: 'BookOpen',
    difficulty: 'Médio',
    description: 'Dicionários armazenam dados no formato chave:valor, como um glossário. Você cria com chaves: `pessoa = {"nome": "Ana", "idade": 30}`. Acesse valores por chave: `pessoa["nome"]`. O método `.get("chave")` retorna `None` se a chave não existir (sem lançar erro). Use `.keys()` para listar as chaves e `.values()` para listar os valores.',
    instructions: 'Crie uma função chamada "descrever_produto" que recebe um dicionário "produto" com as chaves "nome", "preco" e "estoque". A função deve retornar uma string formatada: "Produto: {nome} | Preço: R${preco:.2f} | Estoque: {estoque} unidades". Se a chave "estoque" não existir, use 0 como padrão.',
    codeSkeleton: 'def descrever_produto(produto):\n    # Acesse as chaves do dicionário e monte a string\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - f3_l3
assert 'descrever_produto' in locals(), "A função 'descrever_produto' não foi encontrada."
p1 = {"nome": "Teclado", "preco": 149.90, "estoque": 12}
r1 = descrever_produto(p1)
assert isinstance(r1, str), f"A função deve retornar uma string, mas retornou {type(r1).__name__}."
assert "Teclado" in r1, f"O nome do produto deve aparecer na string, mas o resultado foi: '{r1}'."
assert "149.90" in r1, f"O preço formatado deve aparecer na string, mas o resultado foi: '{r1}'."
assert "12" in r1, f"O estoque deve aparecer na string, mas o resultado foi: '{r1}'."
p2 = {"nome": "Mouse", "preco": 75.0}
r2 = descrever_produto(p2)
assert "0" in r2, f"Quando 'estoque' não existe, deve usar 0 como padrão. Resultado: '{r2}'."
`,
    hint: 'Use produto.get("estoque", 0) para obter o estoque com valor padrão 0. Formate a string com f"Produto: {nome} | Preço: R${preco:.2f} | Estoque: {estoque} unidades".'
  },
  {
    id: 'f3_l4',
    phase: 3,
    phaseTitle: 'Python Intermediário',
    title: 'Compreensão de Listas',
    icon: 'Zap',
    difficulty: 'Médio',
    description: 'List comprehension (compreensão de lista) é uma forma elegante e concisa de criar novas listas em Python. A sintaxe é: `[expressão for item in iterável if condição]`. Exemplo: `pares = [x for x in range(10) if x % 2 == 0]` cria a lista `[0, 2, 4, 6, 8]`. A cláusula `if` é opcional e funciona como filtro.',
    instructions: 'Crie uma função chamada "filtrar_e_dobrar" que recebe uma lista de números inteiros e retorna uma nova lista contendo apenas os números pares da lista original, cada um multiplicado por 2. Use obrigatoriamente list comprehension.',
    codeSkeleton: 'def filtrar_e_dobrar(numeros):\n    # Use list comprehension com filtro para pares e multiplique por 2\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - f3_l4
assert 'filtrar_e_dobrar' in locals(), "A função 'filtrar_e_dobrar' não foi encontrada."
r1 = filtrar_e_dobrar([1, 2, 3, 4, 5, 6])
assert isinstance(r1, list), f"A função deve retornar uma lista, mas retornou {type(r1).__name__}."
assert r1 == [4, 8, 12], f"filtrar_e_dobrar([1,2,3,4,5,6]) deveria retornar [4, 8, 12], mas retornou {r1}."
r2 = filtrar_e_dobrar([1, 3, 5])
assert r2 == [], f"filtrar_e_dobrar([1,3,5]) deveria retornar [] (sem pares), mas retornou {r2}."
r3 = filtrar_e_dobrar([0, 10, 7])
assert r3 == [0, 20], f"filtrar_e_dobrar([0,10,7]) deveria retornar [0, 20], mas retornou {r3}."
`,
    hint: 'A estrutura é: [x * 2 for x in numeros if x % 2 == 0]. O operador % calcula o resto da divisão — se x % 2 == 0, o número é par.'
  },
  {
    id: 'f3_l5',
    phase: 3,
    phaseTitle: 'Python Intermediário',
    title: 'Tratamento de Erros (try/except)',
    icon: 'ShieldAlert',
    difficulty: 'Difícil',
    description: 'Erros em Python geram exceções que, se não tratadas, encerram o programa. O bloco `try` tenta executar o código; `except TipoDoErro` captura erros específicos. Exemplos de exceções: `ZeroDivisionError` (divisão por zero), `ValueError` (conversão inválida), `TypeError` (operação em tipo errado). Tratar exceções específicas é preferível a capturar tudo com `except Exception`.',
    instructions: 'Crie uma função chamada "dividir_seguro" que recebe dois parâmetros: "dividendo" e "divisor". Se o divisor for zero, retorne a string "Erro: divisão por zero". Se algum dos valores não for numérico (levantar TypeError ou ValueError), retorne "Erro: valores inválidos". Caso contrário, retorne o resultado da divisão como float.',
    codeSkeleton: 'def dividir_seguro(dividendo, divisor):\n    # Use try/except para capturar ZeroDivisionError e TypeError\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - f3_l5
assert 'dividir_seguro' in locals(), "A função 'dividir_seguro' não foi encontrada."
r1 = dividir_seguro(10, 2)
assert r1 == 5.0, f"dividir_seguro(10, 2) deveria retornar 5.0, mas retornou {r1}."
r2 = dividir_seguro(7, 0)
assert r2 == "Erro: divisão por zero", f"dividir_seguro(7, 0) deveria retornar 'Erro: divisão por zero', mas retornou '{r2}'."
r3 = dividir_seguro("abc", 2)
assert r3 == "Erro: valores inválidos", f"dividir_seguro('abc', 2) deveria retornar 'Erro: valores inválidos', mas retornou '{r3}'."
r4 = dividir_seguro(9, 3)
assert isinstance(r4, float), f"O resultado de uma divisão válida deve ser float, mas retornou {type(r4).__name__}."
`,
    hint: 'Dentro do bloco try, faça a divisão e retorne o resultado como float(dividendo / divisor). Capture ZeroDivisionError separadamente de TypeError para retornar a mensagem correta em cada caso.'
  },

  // --- FASE 4: PROGRAMAÇÃO ORIENTADA A OBJETOS ---
  {
    id: 'f4_l1',
    phase: 4,
    phaseTitle: 'Programação Orientada a Objetos - POO',
    title: 'Classes e Objetos',
    icon: 'Box',
    difficulty: 'Médio',
    description: 'Uma classe é um molde para criar objetos. O método especial `__init__` é o construtor — ele é chamado automaticamente quando você instancia um objeto com `Classe()`. Dentro do `__init__`, use `self.atributo = valor` para definir os atributos de cada instância. Por exemplo: `cachorro = Cachorro("Rex", 3)` cria um objeto com os atributos definidos.',
    instructions: 'Crie uma classe chamada "Carro" com um método `__init__` que receba os parâmetros "marca", "modelo" e "ano". Armazene-os como atributos da instância. Depois, crie uma instância chamada "meu_carro" com marca="Toyota", modelo="Corolla" e ano=2023.',
    codeSkeleton: 'class Carro:\n    def __init__(self, marca, modelo, ano):\n        # Armazene os atributos aqui\n        pass\n\n# Crie a instância meu_carro aqui\n',
    testAssertions: `
# Suíte de Testes PyLingo - f4_l1
assert 'Carro' in locals() or 'Carro' in dir(), "A classe 'Carro' não foi encontrada."
assert 'meu_carro' in locals(), "A variável 'meu_carro' não foi criada."
assert isinstance(meu_carro, Carro), f"'meu_carro' deve ser uma instância de Carro, mas é {type(meu_carro).__name__}."
assert hasattr(meu_carro, 'marca'), "O objeto 'meu_carro' não possui o atributo 'marca'."
assert meu_carro.marca == "Toyota", f"Atributo 'marca' deveria ser 'Toyota', mas é '{meu_carro.marca}'."
assert hasattr(meu_carro, 'modelo'), "O objeto 'meu_carro' não possui o atributo 'modelo'."
assert meu_carro.modelo == "Corolla", f"Atributo 'modelo' deveria ser 'Corolla', mas é '{meu_carro.modelo}'."
assert hasattr(meu_carro, 'ano'), "O objeto 'meu_carro' não possui o atributo 'ano'."
assert meu_carro.ano == 2023, f"Atributo 'ano' deveria ser 2023, mas é {meu_carro.ano}."
`,
    hint: 'Dentro do __init__, escreva self.marca = marca, self.modelo = modelo e self.ano = ano. Depois, fora da classe, instancie: meu_carro = Carro("Toyota", "Corolla", 2023).'
  },
  {
    id: 'f4_l2',
    phase: 4,
    phaseTitle: 'Programação Orientada a Objetos - POO',
    title: 'Métodos de Instância',
    icon: 'Box',
    difficulty: 'Médio',
    description: 'Métodos são funções definidas dentro de uma classe. O primeiro parâmetro de todo método de instância é `self`, que referencia o próprio objeto. Por meio do `self`, o método pode acessar e modificar os atributos da instância. Métodos encapsulam comportamentos que pertencem ao objeto.',
    instructions: 'Crie uma classe "ContaBancaria" com atributo "saldo" inicializado em 0 pelo `__init__`. Adicione dois métodos: "depositar(valor)" que soma o valor ao saldo, e "sacar(valor)" que subtrai o valor do saldo apenas se o saldo for suficiente — caso contrário, retorne a string "Saldo insuficiente". Ambos os métodos devem retornar o saldo atual após a operação.',
    codeSkeleton: 'class ContaBancaria:\n    def __init__(self):\n        self.saldo = 0\n\n    def depositar(self, valor):\n        # Adicione o valor ao saldo e retorne o saldo\n        pass\n\n    def sacar(self, valor):\n        # Subtraia apenas se houver saldo suficiente\n        pass',
    testAssertions: `
# Suíte de Testes PyLingo - f4_l2
assert 'ContaBancaria' in locals() or 'ContaBancaria' in dir(), "A classe 'ContaBancaria' não foi encontrada."
conta = ContaBancaria()
assert conta.saldo == 0, f"Saldo inicial deveria ser 0, mas é {conta.saldo}."
r1 = conta.depositar(500)
assert conta.saldo == 500, f"Após depositar 500, o saldo deveria ser 500, mas é {conta.saldo}."
assert r1 == 500, f"depositar() deveria retornar o saldo atual (500), mas retornou {r1}."
r2 = conta.sacar(200)
assert conta.saldo == 300, f"Após sacar 200, o saldo deveria ser 300, mas é {conta.saldo}."
assert r2 == 300, f"sacar() deveria retornar o saldo atual (300), mas retornou {r2}."
r3 = conta.sacar(999)
assert r3 == "Saldo insuficiente", f"Sacar mais do que o saldo deveria retornar 'Saldo insuficiente', mas retornou '{r3}'."
assert conta.saldo == 300, f"O saldo não deve mudar após saque recusado. Esperado 300, mas é {conta.saldo}."
`,
    hint: 'Em depositar, faça self.saldo += valor e retorne self.saldo. Em sacar, verifique if valor <= self.saldo: antes de subtrair. Caso contrário, retorne a string "Saldo insuficiente".'
  },
  {
    id: 'f4_l3',
    phase: 4,
    phaseTitle: 'Programação Orientada a Objetos - POO',
    title: 'Encapsulamento',
    icon: 'Lock',
    difficulty: 'Difícil',
    description: 'Encapsulamento protege os dados internos de um objeto de acesso externo direto. Em Python, atributos privados são nomeados com prefixo duplo de underscores: `self.__senha`. Isso ativa o "name mangling" — o Python renomeia internamente o atributo, dificultando o acesso externo. Para expor dados controlados, criamos métodos getters, que validam e retornam o valor de forma segura.',
    instructions: 'Crie uma classe "Usuario" que recebe "nome" e "senha" no `__init__`. Armazene a senha como atributo privado `__senha`. Crie um método "get_nome()" que retorna o nome, e um método "verificar_senha(tentativa)" que retorna True se a tentativa for igual à senha privada, ou False caso contrário.',
    codeSkeleton: 'class Usuario:\n    def __init__(self, nome, senha):\n        self.nome = nome\n        self.__senha = senha  # atributo privado\n\n    def get_nome(self):\n        # Retorne o nome\n        pass\n\n    def verificar_senha(self, tentativa):\n        # Compare tentativa com a senha privada\n        pass',
    testAssertions: `
# Suíte de Testes PyLingo - f4_l3
assert 'Usuario' in locals() or 'Usuario' in dir(), "A classe 'Usuario' não foi encontrada."
u = Usuario("Carlos", "s3cr3t0")
assert hasattr(u, 'nome'), "O atributo 'nome' não foi encontrado."
assert u.get_nome() == "Carlos", f"get_nome() deveria retornar 'Carlos', mas retornou '{u.get_nome()}'."
assert not hasattr(u, '__senha'), "O atributo '__senha' não deve ser acessível diretamente (use name mangling com __)."
assert u.verificar_senha("s3cr3t0") == True, "verificar_senha com a senha correta deveria retornar True."
assert u.verificar_senha("errada") == False, f"verificar_senha com senha incorreta deveria retornar False."
assert u.verificar_senha("") == False, "verificar_senha com string vazia deveria retornar False."
`,
    hint: 'Para armazenar a senha privada, use self.__senha = senha. Em verificar_senha, retorne self.__senha == tentativa. Note que o atributo self.__senha não é acessível como u.__senha externamente.'
  },
  {
    id: 'f4_l4',
    phase: 4,
    phaseTitle: 'Programação Orientada a Objetos - POO',
    title: 'Herança',
    icon: 'GitBranch',
    difficulty: 'Difícil',
    description: 'Herança permite que uma classe filha herde atributos e métodos de uma classe pai, promovendo reuso de código. A sintaxe é `class Filho(Pai)`. A chamada `super().__init__(...)` executa o construtor do pai dentro do filho. O método pode ser sobrescrito (override) na classe filha para alterar o comportamento herdado.',
    instructions: 'Crie uma classe base "Animal" com atributo "nome" e um método "falar()" que retorna "...". Crie uma classe filha "Cachorro" que herda de Animal e sobrescreve o método "falar()" para retornar "Au Au!". Crie outra filha "Gato" que retorna "Miau!". Use super().__init__(nome) no construtor das classes filhas.',
    codeSkeleton: 'class Animal:\n    def __init__(self, nome):\n        self.nome = nome\n\n    def falar(self):\n        return "..."\n\nclass Cachorro(Animal):\n    def __init__(self, nome):\n        # Chame o construtor do pai\n        pass\n\n    def falar(self):\n        # Sobrescreva o método\n        pass\n\nclass Gato(Animal):\n    def __init__(self, nome):\n        pass\n\n    def falar(self):\n        pass',
    testAssertions: `
# Suíte de Testes PyLingo - f4_l4
assert 'Animal' in locals() or 'Animal' in dir(), "A classe 'Animal' não foi encontrada."
assert 'Cachorro' in locals() or 'Cachorro' in dir(), "A classe 'Cachorro' não foi encontrada."
assert 'Gato' in locals() or 'Gato' in dir(), "A classe 'Gato' não foi encontrada."
cachorro = Cachorro("Rex")
assert isinstance(cachorro, Animal), "Cachorro deve ser instância de Animal (herança)."
assert cachorro.nome == "Rex", f"cachorro.nome deveria ser 'Rex', mas é '{cachorro.nome}'."
assert cachorro.falar() == "Au Au!", f"Cachorro.falar() deveria retornar 'Au Au!', mas retornou '{cachorro.falar()}'."
gato = Gato("Whiskers")
assert isinstance(gato, Animal), "Gato deve ser instância de Animal (herança)."
assert gato.nome == "Whiskers", f"gato.nome deveria ser 'Whiskers', mas é '{gato.nome}'."
assert gato.falar() == "Miau!", f"Gato.falar() deveria retornar 'Miau!', mas retornou '{gato.falar()}'."
animal_base = Animal("Genérico")
assert animal_base.falar() == "...", f"Animal.falar() deveria retornar '...', mas retornou '{animal_base.falar()}'."
`,
    hint: 'Na classe Cachorro, chame super().__init__(nome) dentro do __init__. Em seguida, defina def falar(self): return "Au Au!". Repita o mesmo padrão para a classe Gato com "Miau!".'
  },

  // --- FASE 5: ESTRUTURAS DE DADOS E ALGORITMOS ---
  {
    id: 'f5_l1',
    phase: 5,
    phaseTitle: 'Estruturas de Dados e Algoritmos',
    title: 'Busca Binária',
    icon: 'Search',
    difficulty: 'Difícil',
    description: 'A busca binária é um algoritmo eficiente para encontrar um elemento em uma lista **ordenada**. Em vez de verificar cada elemento (busca linear O(n)), ela divide o espaço de busca pela metade a cada passo (O(log n)). O algoritmo mantém dois ponteiros, `esquerda` e `direita`, e calcula o índice do meio. Se o elemento do meio for o alvo, retorna o índice. Se for maior, busca na metade esquerda. Se for menor, busca na metade direita.',
    instructions: 'Crie uma função "busca_binaria" que recebe uma lista de inteiros ordenada "lista" e um inteiro "alvo". A função deve retornar o índice do alvo na lista, ou -1 se ele não existir. Implemente de forma iterativa (com loop while), sem recursão.',
    codeSkeleton: 'def busca_binaria(lista, alvo):\n    esquerda = 0\n    direita = len(lista) - 1\n    # Implemente o loop while aqui\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - f5_l1
assert 'busca_binaria' in locals(), "A função 'busca_binaria' não foi encontrada."
lista_teste = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
assert busca_binaria(lista_teste, 23) == 5, f"busca_binaria(lista, 23) deveria retornar 5, mas retornou {busca_binaria(lista_teste, 23)}."
assert busca_binaria(lista_teste, 2) == 0, f"busca_binaria(lista, 2) deveria retornar 0 (primeiro elemento), mas retornou {busca_binaria(lista_teste, 2)}."
assert busca_binaria(lista_teste, 91) == 9, f"busca_binaria(lista, 91) deveria retornar 9 (último elemento), mas retornou {busca_binaria(lista_teste, 91)}."
assert busca_binaria(lista_teste, 99) == -1, f"busca_binaria(lista, 99) deveria retornar -1 (não encontrado), mas retornou {busca_binaria(lista_teste, 99)}."
assert busca_binaria([], 5) == -1, f"busca_binaria([], 5) deveria retornar -1 (lista vazia), mas retornou {busca_binaria([], 5)}."
`,
    hint: 'Enquanto esquerda <= direita, calcule meio = (esquerda + direita) // 2. Se lista[meio] == alvo, retorne meio. Se lista[meio] < alvo, mova esquerda = meio + 1. Caso contrário, mova direita = meio - 1. Se sair do loop sem encontrar, retorne -1.'
  },
  {
    id: 'f5_l2',
    phase: 5,
    phaseTitle: 'Estruturas de Dados e Algoritmos',
    title: 'Bubble Sort',
    icon: 'ArrowUpDown',
    difficulty: 'Difícil',
    description: 'Bubble Sort é um algoritmo de ordenação simples que funciona comparando pares adjacentes de elementos e trocando-os de posição se estiverem fora de ordem. A cada passagem pelo array, o maior elemento "borbulha" para o final. O algoritmo tem complexidade O(n²) e é ideal para aprender os fundamentos de ordenação. Uma otimização importante: se nenhuma troca ocorrer em uma passagem completa, a lista já está ordenada e podemos parar.',
    instructions: 'Crie uma função "bubble_sort" que recebe uma lista de inteiros e retorna uma nova lista ordenada em ordem crescente, implementando o algoritmo Bubble Sort. Não use a função sorted() do Python nem o método .sort() — implemente o algoritmo manualmente.',
    codeSkeleton: 'def bubble_sort(lista):\n    # Crie uma cópia para não modificar a lista original\n    arr = lista[:]\n    n = len(arr)\n    # Implemente o Bubble Sort aqui\n    return arr',
    testAssertions: `
# Suíte de Testes PyLingo - f5_l2
assert 'bubble_sort' in locals(), "A função 'bubble_sort' não foi encontrada."
r1 = bubble_sort([64, 34, 25, 12, 22, 11, 90])
assert r1 == [11, 12, 22, 25, 34, 64, 90], f"bubble_sort([64,34,25,12,22,11,90]) deveria retornar [11,12,22,25,34,64,90], mas retornou {r1}."
r2 = bubble_sort([1])
assert r2 == [1], f"bubble_sort([1]) deveria retornar [1], mas retornou {r2}."
r3 = bubble_sort([])
assert r3 == [], f"bubble_sort([]) deveria retornar [], mas retornou {r3}."
r4 = bubble_sort([5, 5, 3, 1, 3])
assert r4 == [1, 3, 3, 5, 5], f"bubble_sort com duplicatas deveria retornar [1,3,3,5,5], mas retornou {r4}."
original = [3, 1, 2]
bubble_sort(original)
assert original == [3, 1, 2], f"A função não deve modificar a lista original, mas original virou {original}."
`,
    hint: 'Use dois loops aninhados: o externo (i de 0 a n-1) controla as passagens e o interno (j de 0 a n-i-2) compara pares adjacentes. Se arr[j] > arr[j+1], troque-os: arr[j], arr[j+1] = arr[j+1], arr[j].'
  },
  {
    id: 'f5_l3',
    phase: 5,
    phaseTitle: 'Estruturas de Dados e Algoritmos',
    title: 'Pilha com Listas',
    icon: 'Layers',
    difficulty: 'Médio',
    description: 'Uma pilha (Stack) é uma estrutura de dados LIFO — Last In, First Out (Último a Entrar, Primeiro a Sair). Pense em uma pilha de pratos: você sempre adiciona e remove do topo. As operações fundamentais são: `push` (empilhar), `pop` (desempilhar), `peek` (ver o topo sem remover) e `is_empty` (verificar se está vazia). Em Python, podemos implementar uma pilha usando uma lista simples.',
    instructions: 'Crie uma classe "Pilha" com os métodos: "push(elemento)" que adiciona ao topo; "pop()" que remove e retorna o elemento do topo (retorne None se vazia); "peek()" que retorna o elemento do topo sem remover (retorne None se vazia); "is_empty()" que retorna True se a pilha estiver vazia.',
    codeSkeleton: 'class Pilha:\n    def __init__(self):\n        self._dados = []\n\n    def push(self, elemento):\n        pass\n\n    def pop(self):\n        pass\n\n    def peek(self):\n        pass\n\n    def is_empty(self):\n        pass',
    testAssertions: `
# Suíte de Testes PyLingo - f5_l3
assert 'Pilha' in locals() or 'Pilha' in dir(), "A classe 'Pilha' não foi encontrada."
p = Pilha()
assert p.is_empty() == True, "Pilha recém-criada deve estar vazia (is_empty() == True)."
p.push(10)
p.push(20)
p.push(30)
assert p.is_empty() == False, "Após inserções, is_empty() deve retornar False."
assert p.peek() == 30, f"peek() deve retornar 30 (topo), mas retornou {p.peek()}."
r1 = p.pop()
assert r1 == 30, f"pop() deve retornar 30 (último empilhado), mas retornou {r1}."
assert p.peek() == 20, f"Após pop(), peek() deve retornar 20, mas retornou {p.peek()}."
p.pop()
p.pop()
assert p.is_empty() == True, "Após remover todos os elementos, is_empty() deve ser True."
assert p.pop() == None, "pop() em pilha vazia deve retornar None."
assert p.peek() == None, "peek() em pilha vazia deve retornar None."
`,
    hint: 'Use self._dados.append(elemento) no push. Em pop(), verifique if self.is_empty(): return None, senão use return self._dados.pop(). Em peek(), retorne self._dados[-1] se não estiver vazia. Em is_empty(), retorne len(self._dados) == 0.'
  },

  // --- FASE 6: GIT E GITHUB ---
  {
    id: 'f6_l1',
    phase: 6,
    phaseTitle: 'Git e GitHub',
    title: 'Área de Staging e Commit',
    icon: 'GitBranch',
    difficulty: 'Fácil',
    description: 'O Git é um sistema de controle de versão distribuído. Duas de suas principais áreas são: a Staging Area (onde preparamos arquivos com `git add`) e o repositório local (onde salvamos permanentemente as alterações com `git commit`). Desta forma, podemos escolher exatamente o que vai em cada pacote de alteração.',
    instructions: 'Implemente uma classe `MiniGit` com os métodos: `__init__(self)` (inicializa `self.staging` como dicionário vazio e `self.commits` como lista vazia); `add(self, arquivo, conteudo)` (insere o arquivo e seu conteúdo no staging); e `commit(self, mensagem)` (cria um commit com ID incremental iniciando em 1, a mensagem e uma cópia dos arquivos do staging, limpa o staging e retorna o ID do commit).',
    codeSkeleton: 'class MiniGit:\n    def __init__(self):\n        # Inicialize staging e commits aqui\n        pass\n\n    def add(self, arquivo, conteudo):\n        # Adicione arquivo ao staging\n        pass\n\n    def commit(self, mensagem):\n        # Crie o commit e retorne o ID incremental\n        pass',
    testAssertions: `
# Suíte de Testes PyLingo - MiniGit
assert 'MiniGit' in locals(), "A classe 'MiniGit' não foi definida."
git = MiniGit()
assert hasattr(git, 'staging') and isinstance(git.staging, dict), "Você deve inicializar 'self.staging' como um dicionário."
assert hasattr(git, 'commits') and isinstance(git.commits, list), "Você deve inicializar 'self.commits' como uma lista."

git.add("main.py", "print('Olá')")
assert git.staging.get("main.py") == "print('Olá')", "O método 'add' deve salvar o arquivo na staging area."

id_commit = git.commit("Primeiro commit")
assert id_commit == 1, "O primeiro commit deve retornar o ID 1."
assert len(git.staging) == 0, "A staging area deve ser esvaziada imediatamente após o commit."
assert len(git.commits) == 1, "A lista de commits deve conter exatamente 1 registro."
assert git.commits[0]["mensagem"] == "Primeiro commit", "A mensagem do commit está incorreta."
assert git.commits[0]["arquivos"].get("main.py") == "print('Olá')", "Os arquivos salvos no commit divergem do staging original."
`,
    hint: 'Em __init__, defina self.staging = {} e self.commits = []. Em add, self.staging[arquivo] = conteudo. Em commit, o ID é len(self.commits) + 1. Faça uma cópia usando dict(self.staging), salve um dicionário em self.commits com as chaves "id", "mensagem" e "arquivos", esvazie o staging com self.staging.clear() ou self.staging = {}, e retorne o ID.'
  },

  // --- FASE 7: BANCOS DE DADOS ---
  {
    id: 'f7_l1',
    phase: 7,
    phaseTitle: 'Bancos de Dados',
    title: 'Criação e Inserção SQL',
    icon: 'Database',
    difficulty: 'Médio',
    description: 'Bancos de dados relacionais organizam dados em tabelas com linhas e colunas. Em Python, o módulo nativo `sqlite3` permite rodar comandos SQL de verdade. Usamos `CREATE TABLE` para estruturar e `INSERT INTO` para registrar dados. Após alterações de escrita, chame `.commit()` na conexão para salvar.',
    instructions: 'Crie uma função `criar_banco()` que se conecta a um banco de dados SQLite em memória (`":memory:"`), cria uma tabela `alunos` com os campos `id` (INTEGER PRIMARY KEY), `nome` (TEXT) e `nota` (REAL). Insira os alunos ("Lingo", 9.5) e ("Python", 10.0), salve com commit e retorne o resultado de `cursor.execute("SELECT * FROM alunos").fetchall()`.',
    codeSkeleton: 'import sqlite3\n\ndef criar_banco():\n    # Conecte, crie a tabela, insira os registros e retorne fetchall()\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - SQLite 1
assert 'criar_banco' in locals(), "A função 'criar_banco' não foi declarada."
res = criar_banco()
assert isinstance(res, list), "Sua função deve retornar uma lista contendo os registros buscados."
assert len(res) == 2, f"Deveriam haver exatamente 2 registros na tabela 'alunos', mas o retorno foi: {res}."
nomes = [row[1] for row in res]
assert "Lingo" in nomes and "Python" in nomes, "Os nomes dos alunos inseridos estão incorretos."
`,
    hint: 'Use conn = sqlite3.connect(":memory:") e cursor = conn.cursor(). Execute "CREATE TABLE alunos (id INTEGER PRIMARY KEY, nome TEXT, nota REAL)". Faça a inserção com "INSERT INTO alunos (nome, nota) VALUES (?, ?)" passando os dados. Não esqueça de conn.commit() e retornar cursor.execute("SELECT * FROM alunos").fetchall().'
  },
  {
    id: 'f7_l2',
    phase: 7,
    phaseTitle: 'Bancos de Dados',
    title: 'Queries e Filtros SQL',
    icon: 'Database',
    difficulty: 'Médio',
    description: 'A linguagem SQL fornece filtros usando a cláusula `WHERE` e ordenação usando `ORDER BY`. Por exemplo: `SELECT * FROM produtos WHERE preco > 50 ORDER BY nome DESC` seleciona e ordena produtos de forma decrescente.',
    instructions: 'Escreva uma função `filtrar_aprovados(conexao)` que recebe uma conexão SQLite ativa. Ela deve consultar e retornar os registros (fetchall) da tabela `alunos` onde a nota seja maior ou igual a 7.0, ordenados de forma decrescente pela nota.',
    codeSkeleton: 'def filtrar_aprovados(conexao):\n    cursor = conexao.cursor()\n    # Execute a consulta filtrada e ordenada e retorne o resultado\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - SQLite 2
import sqlite3
assert 'filtrar_aprovados' in locals(), "A função 'filtrar_aprovados' não foi declarada."

# Banco em memória para isolamento do teste
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
cursor.execute("CREATE TABLE alunos (id INTEGER, nome TEXT, nota REAL)")
cursor.executemany("INSERT INTO alunos VALUES (?, ?, ?)", [
    (1, "Ana", 5.5),
    (2, "Lingo", 9.5),
    (3, "Beto", 7.0),
    (4, "Carlos", 6.9)
])
conn.commit()

resultado = filtrar_aprovados(conn)
assert len(resultado) == 2, f"Sua consulta deve retornar apenas os 2 alunos aprovados (nota >= 7.0), mas retornou: {len(resultado)}."
assert resultado[0][1] == "Lingo" and resultado[1][1] == "Beto", "Os registros de aprovação retornados ou sua ordenação decrescente estão incorretos."
`,
    hint: 'Execute a consulta: "SELECT * FROM alunos WHERE nota >= 7.0 ORDER BY nota DESC" no cursor e retorne cursor.fetchall().'
  },

  // --- FASE 8: DESENVOLVIMENTO WEB ---
  {
    id: 'f8_l1',
    phase: 8,
    phaseTitle: 'Desenvolvimento Web',
    title: 'Roteador HTTP Simples',
    icon: 'Globe',
    difficulty: 'Médio',
    description: 'No desenvolvimento web backend, roteamento é o processo de mapear requisições HTTP (composta por um método como GET ou POST e um caminho ou path) para funções resolvedoras (handlers) específicas no servidor.',
    instructions: 'Implemente uma classe `WebRouter` que contenha: `__init__(self)` (inicializa `self.rotas` como dicionário vazio); `registrar(self, metodo, path, handler)` (mapeia o par `(metodo, path)` para a função `handler` no dicionário); e `despachar(self, metodo, path)` (busca a rota correspondente, executa o handler e retorna o resultado. Se não existir, retorna a tupla `(404, "Não Encontrado")`).',
    codeSkeleton: 'class WebRouter:\n    def __init__(self):\n        pass\n\n    def registrar(self, metodo, path, handler):\n        pass\n\n    def despachar(self, metodo, path):\n        pass',
    testAssertions: `
# Suíte de Testes PyLingo - WebRouter
assert 'WebRouter' in locals(), "A classe 'WebRouter' não foi definida."
router = WebRouter()
assert hasattr(router, 'rotas') and isinstance(router.rotas, dict), "Você deve inicializar 'self.rotas' como um dicionário."

router.registrar("GET", "/home", lambda: (200, "Home Page"))
router.registrar("POST", "/login", lambda: (201, "Autenticado"))

assert router.despachar("GET", "/home") == (200, "Home Page"), "O roteador falhou ao despachar uma requisição GET válida."
assert router.despachar("POST", "/login") == (201, "Autenticado"), "O roteador falhou ao despachar uma requisição POST válida."
assert router.despachar("GET", "/dashboard") == (404, "Não Encontrado"), "Rotas não cadastradas devem retornar o código de status 404 de fallback."
`,
    hint: 'Em registrar, salve a chave (metodo, path) mapeada para o handler. Em despachar, verifique se a tupla chave está em self.rotas — se sim, chame-a usando self.rotas[(metodo, path)](), senão retorne (404, "Não Encontrado").'
  },
  {
    id: 'f8_l2',
    phase: 8,
    phaseTitle: 'Desenvolvimento Web',
    title: 'Parser de Query String',
    icon: 'Globe',
    difficulty: 'Fácil',
    description: 'A query string é a parte da URL usada para enviar parâmetros opcionais ao servidor (ex: `busca=python&limite=10`). As chaves e valores são separados por `=` e os pares separados por `&`. Decodificar essa string em uma estrutura de dados útil (como dicionário) é fundamental no desenvolvimento de APIs.',
    instructions: 'Escreva uma função `parse_query_string(query)` que recebe uma string de consulta e retorna um dicionário com os respectivos parâmetros decodificados. Se a string for vazia, retorne um dicionário vazio.',
    codeSkeleton: 'def parse_query_string(query):\n    # Escreva sua lógica de decodificação e retorne o dicionário correspondente\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - Query String
assert 'parse_query_string' in locals(), "A função 'parse_query_string' não foi declarada."
assert parse_query_string("") == {}, "Query strings vazias devem resultar em um dicionário vazio."

parsed = parse_query_string("busca=python&limite=10")
assert parsed.get("busca") == "python", "Falha ao decodificar chave 'busca'."
assert parsed.get("limite") == "10", "Falha ao decodificar chave 'limite'."
assert len(parsed) == 2, "O dicionário resultante possui mais chaves do que o esperado."
`,
    hint: 'Use query.split("&") para separar cada par chave=valor. Em seguida, para cada par, use split("=") para extrair chave e valor, salvando-os em um dicionário de retorno.'
  },

  // --- FASE 9: TESTES AUTOMATIZADOS ---
  {
    id: 'f9_l1',
    phase: 9,
    phaseTitle: 'Testes Automatizados',
    title: 'Escrevendo Testes Unitários',
    icon: 'ShieldCheck',
    difficulty: 'Difícil',
    description: 'Testes unitários garantem que partes individuais de um código funcionam perfeitamente de forma isolada. O módulo padrão `unittest` do Python nos permite estruturar casos de teste herdando da classe `unittest.TestCase` e utilizando asserções baseadas em métodos de classe como `self.assertEqual` ou `self.assertRaises`.',
    instructions: 'Escreva uma classe de teste chamada `TestJurosCompostos` que herda de `unittest.TestCase` para validar a função `juros_compostos(capital, taxa, tempo)` (que já estará disponível em memória). Crie dois métodos: (1) `test_calculo_normal(self)` que valida se `juros_compostos(1000, 0.1, 2)` é igual a 1210.0; e (2) `test_valores_invalidos(self)` que valida se passar um valor negativo para capital (ex: -100) levanta a exceção `ValueError`.',
    codeSkeleton: 'import unittest\n\nclass TestJurosCompostos(unittest.TestCase):\n    # Defina os métodos de teste requisitados abaixo\n    pass',
    testAssertions: `
# Injetando a função alvo do teste no escopo de execução
def juros_compostos(capital, taxa, tempo):
    if capital < 0 or taxa < 0 or tempo < 0:
        raise ValueError("Valores negativos não são válidos para o cálculo.")
    return round(capital * ((1 + taxa) ** tempo), 2)

globals()['juros_compostos'] = juros_compostos

assert 'TestJurosCompostos' in locals(), "A classe de teste 'TestJurosCompostos' não foi declarada."
import sys, unittest

# Harness seguro para rodar unittest de forma controlada em WASM/Web Worker sem SystemExit
suite = unittest.TestSuite()
suite.addTest(TestJurosCompostos('test_calculo_normal'))
suite.addTest(TestJurosCompostos('test_valores_invalidos'))

runner = unittest.TextTestRunner(stream=sys.stdout)
result = runner.run(suite)

assert result.wasSuccessful(), f"A validação dos seus testes falhou: {result.failures}"
`,
    hint: 'No método test_calculo_normal, use self.assertEqual(juros_compostos(1000, 0.1, 2), 1210.0). No método test_valores_invalidos, use o gerenciador de contexto: with self.assertRaises(ValueError): juros_compostos(-100, 0.1, 2).'
  },

  // --- FASE 10: PROJETOS DE PORTFÓLIO ---
  {
    id: 'f10_l1',
    phase: 10,
    phaseTitle: 'Projetos de Portfólio',
    title: 'Compactador RLE',
    icon: 'FolderArchive',
    difficulty: 'Difícil',
    description: 'O algoritmo Run-Length Encoding (RLE) é uma técnica simples de compressão de dados sem perda. Ele reduz sequências consecutivas do mesmo caractere pela contagem da sequência seguida do caractere correspondente. Por exemplo: "AAAAABBBCC" é compactado para "5A3B2C".',
    instructions: 'Implemente duas funções: `compactar(texto)` que recebe um texto e o retorna compactado por RLE; e `descompactar(texto_compactado)` que realiza a operação inversa, expandindo a string original a partir das contagens.',
    codeSkeleton: 'def compactar(texto):\n    # Escreva seu algoritmo de compactação RLE aqui\n    pass\n\ndef descompactar(texto_compactado):\n    # Escreva a lógica reversa de descompressão RLE\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - RLE
assert 'compactar' in locals() and 'descompactar' in locals(), "As funções de compactação ou descompactação estão ausentes."
assert compactar("AAAAABBBCC") == "5A3B2C", "Sua função compactar falhou ao tratar o caso básico."
assert compactar("XYZ") == "1X1Y1Z", "Falha ao tratar sequências unitárias."
assert descompactar("5A3B2C") == "AAAAABBBCC", "Sua função de descompactar falhou ao remontar a string original."
assert descompactar(compactar("WWWWWWWWWW")) == "WWWWWWWWWW", "O fluxo completo de compressão e descompressão está gerando perdas."
`,
    hint: 'Em compactar, percorra a string mantendo um contador do caractere atual e, quando ele mudar, adicione f"{contador}{caractere}" ao resultado. Em descompactar, leia os dígitos (contagem) e multiplique-os pelo caractere seguinte, ex: int(contador) * caractere.'
  },
  {
    id: 'f10_l2',
    phase: 10,
    phaseTitle: 'Projetos de Portfólio',
    title: 'Validador de Sintaxe JSON',
    icon: 'FolderCheck',
    difficulty: 'Difícil',
    description: 'A pilha (Stack) é a estrutura de dados LIFO ideal para validar o aninhamento e fechamento correto de delimitadores sintáticos como chaves `{}`, colchetes `[]` e parênteses `()`. Se encontrarmos um delimitador de fechamento, ele deve obrigatoriamente corresponder ao último delimitador de abertura inserido no topo da pilha.',
    instructions: 'Escreva uma função `validar_delimitadores(texto)` que avalia uma string e retorna `True` se todas as chaves `{}` e colchetes `[]` estiverem balanceados e aninhados na ordem correta, e `False` caso contrário.',
    codeSkeleton: 'def validar_delimitadores(texto):\n    # Utilize uma estrutura de dados de Pilha para resolver o problema\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - Validador JSON
assert 'validar_delimitadores' in locals(), "A função 'validar_delimitadores' não foi declarada."
assert validar_delimitadores('{"id": ["A", "B"]}') is True, "Sua validação falhou ao aceitar um JSON sintaticamente perfeito."
assert validar_delimitadores('{[}]') is False, "Sua validação falhou ao não recusar um cruzamento ilegal de delimitadores."
assert validar_delimitadores('{{}') is False, "Delimitadores sem correspondente aberto/fechado devem retornar False."
`,
    hint: 'Use uma lista como pilha. Ao encontrar "{" ou "[", adicione na pilha. Ao encontrar "}" ou "]", verifique se a pilha não está vazia e se o elemento removido do topo combina com o caractere encontrado. No final, a pilha deve estar vazia.'
  },

  // --- FASE 11: PREPARAÇÃO ESPECIALISTA BIG TECH ---
  {
    id: 'f11_l1',
    phase: 11,
    phaseTitle: 'Preparação Especialista Big Tech',
    title: 'Inverter Árvore Binária',
    icon: 'Activity',
    difficulty: 'Difícil',
    description: 'A inversão de árvores binárias (famoso desafio do LeetCode) consiste em trocar recursivamente os filhos da esquerda e da direita de cada nó da árvore. É uma excelente forma de praticar manipulação de ponteiros e recursão em estruturas não-lineares.',
    instructions: 'Escreva a função `inverter_arvore(raiz)` que recebe a raiz de uma árvore binária (usando a classe TreeNode que já está declarada) e realiza a inversão in-place de todos os seus nós esquerdos e direitos, retornando a própria raiz.',
    codeSkeleton: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef inverter_arvore(raiz):\n    # Implemente a inversão estrutural recursiva e retorne a raiz\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - LeetCode 226
assert 'inverter_arvore' in locals(), "A função 'inverter_arvore' não foi definida."

# Criando árvore mock: 4 (2 (1, 3), 7)
raiz = TreeNode(4, TreeNode(2, TreeNode(1), TreeNode(3)), TreeNode(7))
inverter_arvore(raiz)

assert raiz.left.val == 7, "A inversão falhou no nó esquerdo da raiz principal."
assert raiz.right.val == 2, "A inversão falhou no nó direito da raiz principal."
assert raiz.right.left.val == 3 and raiz.right.right.val == 1, "A inversão falhou ao propagar recursivamente para os nós folhas."
`,
    hint: 'Se a raiz for None, retorne None. Caso contrário, troque os filhos: raiz.left, raiz.right = raiz.right, raiz.left. Em seguida, chame recursivamente inverter_arvore(raiz.left) e inverter_arvore(raiz.right), e por fim retorne a raiz.'
  },
  {
    id: 'f11_l2',
    phase: 11,
    phaseTitle: 'Preparação Especialista Big Tech',
    title: 'Two Sum',
    icon: 'Activity',
    difficulty: 'Difícil',
    description: 'O clássico problema "Two Sum" (número 1 do LeetCode) pede para encontrar dois números em um vetor que somem um valor alvo e retornar seus índices. Uma solução de força bruta com loops aninhados tem complexidade O(N²). Para passar nas Big Techs, você precisa de uma solução otimizada com complexidade linear O(N) usando Hash Maps (dicionários em Python).',
    instructions: 'Escreva uma função `two_sum(nums, alvo)` que retorna uma lista com os dois índices dos números que somam o valor alvo. A solução deve obrigatoriamente rodar em tempo linear O(N) para passar no teste de estresse.',
    codeSkeleton: 'def two_sum(nums, alvo):\n    # Otimize sua busca usando Hash Map (dicionário em Python) para ser O(N)\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo - LeetCode 1
assert 'two_sum' in locals(), "A função 'two_sum' não foi declarada."
assert sorted(two_sum([2, 7, 11, 15], 9)) == [0, 1], "Sua função falhou no caso de teste básico."
assert sorted(two_sum([3, 2, 4], 6)) == [1, 2], "Sua função falhou ao mapear elementos fora de ordem de tamanho."

# Teste de Estresse para Forçar Complexidade O(N)
lista_longa = list(range(10000))
alvo_estresse = 19997
import time
inicio = time.time()
res_estresse = two_sum(lista_longa, alvo_estresse)
tempo_gasto = time.time() - inicio

assert sorted(res_estresse) == [9998, 9999], "A busca falhou ao localizar elementos em grandes conjuntos."
assert tempo_gasto < 0.15, f"Estouro de Complexidade! Seu código demorou {tempo_gasto:.2f}s. Utilize um Hash Map para atingir performance O(N) linear."
`,
    hint: 'Use um dicionário para mapear o número complementar (alvo - num) para seu índice. Conforme itera por nums com enumerate, verifique se o número atual já está no dicionário. Se sim, você encontrou o par! Senão, adicione o número complementar e seu índice no dicionário.'
  }
];

export const ROADMAP_PHASES = [
  { phase: 1, title: 'Fundamentos de Computação' },
  { phase: 2, title: 'Python Básico' },
  { phase: 3, title: 'Python Intermediário' },
  { phase: 4, title: 'Programação Orientada a Objetos - POO' },
  { phase: 5, title: 'Estruturas de Dados e Algoritmos' },
  { phase: 6, title: 'Git e GitHub' },
  { phase: 7, title: 'Bancos de Dados' },
  { phase: 8, title: 'Desenvolvimento Web' },
  { phase: 9, title: 'Testes Automatizados' },
  { phase: 10, title: 'Projetos de Portfólio' },
  { phase: 11, title: 'Preparação Especialista Big Tech' }
];
