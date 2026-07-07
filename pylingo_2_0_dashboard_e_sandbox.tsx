import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Heart, 
  Flame, 
  Award, 
  BookOpen, 
  Code2, 
  ChevronRight, 
  Lock, 
  Unlock,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Terminal,
  Trophy,
  Compass,
  ArrowLeft,
  Glasses
} from 'lucide-react';

// --- CONFIGURAÇÃO DAS LIÇÕES ---
const LESSONS_DATABASE = [
  {
    id: 'f1_l1',
    phase: 1,
    phaseTitle: 'Fundamentos de Computação',
    title: 'O Primeiro Print',
    icon: 'BookOpen',
    difficulty: 'Fácil',
    description: 'A saída padrão é a forma que os programas se comunicam com o mundo. Em Python, usamos a função print().',
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
    id: 'f2_l1',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Criando Variáveis',
    icon: 'Code2',
    difficulty: 'Fácil',
    description: 'Variáveis guardam dados na memória. Em Python, basta dar um nome e usar o sinal de igual (=) para atribuir um valor.',
    instructions: 'Crie uma variável chamada "resposta" e atribua a ela o valor inteiro 42.',
    codeSkeleton: '# Crie a variável resposta\n',
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
    title: 'Função do Dobro',
    icon: 'Code2',
    difficulty: 'Médio',
    description: 'Funções são blocos de código reaproveitáveis que recebem parâmetros e retornam resultados usando a palavra return.',
    instructions: 'Crie uma função chamada "dobro" que recebe um parâmetro "n" e retorna o dobro dele.',
    codeSkeleton: 'def dobro(n):\n    # Escreva sua lógica aqui\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'dobro' in locals(), "Função 'dobro' não encontrada."
assert callable(dobro), "Certifique-se de definir 'dobro' como uma função usando def."
assert dobro(5) == 10, f"dobro(5) deveria retornar 10, mas retornou {dobro(5)}."
assert dobro(-2) == -4, f"dobro(-2) deveria retornar -4, mas retornou {dobro(-2)}."
`,
    hint: 'Lembre-se de indentar o corpo da função com 4 espaços e retornar o valor usando a palavra-chave "return".'
  },
  {
    id: 'f2_l3',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Par ou Ímpar',
    icon: 'Code2',
    difficulty: 'Médio',
    description: 'Podemos usar o operador de módulo (%) para encontrar o resto da divisão. Se n % 2 for igual a 0, o número é par.',
    instructions: 'Crie uma função "eh_par" que recebe um número "n". Ela deve retornar True se o número for par e False se for ímpar.',
    codeSkeleton: 'def eh_par(n):\n    # Utilize condicionais if/else\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'eh_par' in locals(), "Função 'eh_par' não encontrada."
assert eh_par(4) is True, "eh_par(4) deveria retornar True."
assert eh_par(7) is False, "eh_par(7) deveria retornar False."
`,
    hint: 'Use "if n % 2 == 0:" para testar se o número é par.'
  },
  {
    id: 'f2_l4',
    phase: 2,
    phaseTitle: 'Python Básico',
    title: 'Loops de Soma',
    icon: 'Code2',
    difficulty: 'Difícil',
    description: 'Loops for ou while nos ajudam a repetir operações. Vamos acumular valores sequenciais de 1 até N.',
    instructions: 'Crie uma função "soma_ate" que recebe um inteiro "n" e retorna a soma de todos os inteiros positivos de 1 até n.',
    codeSkeleton: 'def soma_ate(n):\n    # Use um loop para acumular a soma\n    pass',
    testAssertions: `
# Suíte de Testes PyLingo
assert 'soma_ate' in locals(), "Função 'soma_ate' não encontrada."
assert soma_ate(5) == 15, f"soma_ate(5) deveria ser 15 (1+2+3+4+5), mas retornou {soma_ate(5)}."
assert soma_ate(1) == 1, f"soma_ate(1) deveria ser 1, mas retornou {soma_ate(1)}."
`,
    hint: 'Inicie uma variável acumuladora em 0 e use: for i in range(1, n + 1): acumulador += i'
  }
];

export default function App() {
  // --- ESTADO GLOBAL ---
  const [xp, setXp] = useState(150);
  const [hearts, setHearts] = useState(5);
  const [streak, setStreak] = useState(3);
  const [coins, setCoins] = useState(45);
  const [unlockedLessons, setUnlockedLessons] = useState(['f1_l1']);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // --- ESTADO DE NAVEGAÇÃO ---
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'sandbox' | 'shop'
  const [currentLesson, setCurrentLesson] = useState(null); // lesson object or null
  
  // --- ESTADO DO SANDBOX / EDITOR ---
  const [code, setCode] = useState('');
  const [outputConsole, setOutputConsole] = useState('');
  const [executionError, setExecutionError] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState(null); // null, true, false
  const [socraticFeedback, setSocraticFeedback] = useState('');
  
  // --- ESTADOS DO MASCOTE ---
  // 'happy' | 'thinking' | 'sad' | 'geek'
  const [mascotMood, setMascotMood] = useState('thinking');

  // --- ENGINE PYODIDE (WASM) ---
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const pyodideRef = useRef(null);

  // Inicializa o Pyodide assincronamente via CDN
  useEffect(() => {
    const initPyodide = async () => {
      if (window.loadPyodide && !pyodideRef.current) {
        setPyodideLoading(true);
        try {
          const py = await window.loadPyodide();
          pyodideRef.current = py;
          setPyodideReady(true);
          setPyodideLoading(false);
          setMascotMood('happy');
          setTimeout(() => setMascotMood('thinking'), 2000);
        } catch (err) {
          console.error("Erro ao carregar o interpretador Python:", err);
          setPyodideLoading(false);
        }
        return;
      }

      if (!window.loadPyodide) {
        setPyodideLoading(true);
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
        script.onload = async () => {
          try {
            const py = await window.loadPyodide();
            pyodideRef.current = py;
            setPyodideReady(true);
            setPyodideLoading(false);
            setMascotMood('happy');
            setTimeout(() => setMascotMood('thinking'), 2000);
          } catch (err) {
            console.error("Erro ao instanciar Pyodide:", err);
            setPyodideLoading(false);
          }
        };
        script.onerror = () => {
          setPyodideLoading(false);
        };
        document.body.appendChild(script);
      }
    };

    initPyodide();
  }, []);

  // --- SÍNTESE DE ÁUDIO WEB API ---
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        // Chime alegre ascendente
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.45); // C6
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } else if (type === 'error') {
        // Tom grave descendente triste
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220.00, audioCtx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(110.00, audioCtx.currentTime + 0.4); // A2
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === 'click') {
        // Pop rápido de interface
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn("Áudio não suportado ou bloqueado pelo navegador", e);
    }
  };

  // --- SELECIONAR LIÇÃO ---
  const handleSelectLesson = (lesson) => {
    playSound('click');
    if (!unlockedLessons.includes(lesson.id)) return;
    setCurrentLesson(lesson);
    setCode(lesson.codeSkeleton);
    setOutputConsole('');
    setExecutionError('');
    setEvaluationSuccess(null);
    setSocraticFeedback('');
    setMascotMood('thinking');
  };

  // --- EXECUTAR CÓDIGO (APENAS RUNTIME) ---
  const executeCodeOnly = async () => {
    if (!pyodideReady) {
      setOutputConsole("Aguardando inicialização do interpretador Python...");
      return;
    }
    playSound('click');
    setIsEvaluating(true);
    setMascotMood('thinking');
    
    try {
      // Capturar stdout
      await pyodideRef.current.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
      `);

      // Rodar o código do usuário
      await pyodideRef.current.runPythonAsync(code);

      // Obter saídas
      const stdout = await pyodideRef.current.runPythonAsync("sys.stdout.getvalue()");
      const stderr = await pyodideRef.current.runPythonAsync("sys.stderr.getvalue()");
      
      setOutputConsole(stdout + (stderr ? "\nErro:\n" + stderr : ""));
      setExecutionError('');
    } catch (err) {
      setExecutionError(err.message);
      setOutputConsole(err.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  // --- VERIFICAR DESAFIO (RUNNER COM TESTES) ---
  const handleVerifyLesson = async () => {
    if (!pyodideReady) {
      setOutputConsole("Interpretador Python ainda está carregando...");
      return;
    }

    playSound('click');
    setIsEvaluating(true);
    setMascotMood('thinking');
    setOutputConsole('');
    setExecutionError('');

    try {
      // Configurar a captura de stdout
      await pyodideRef.current.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
      `);

      // 1. Executar o código do usuário
      await pyodideRef.current.runPythonAsync(code);

      // 2. Executar as asserções de teste exclusivas da lição
      if (currentLesson.testAssertions) {
        await pyodideRef.current.runPythonAsync(currentLesson.testAssertions);
      }

      // Se passou por todas as asserções sem disparar AssertionError:
      const stdout = await pyodideRef.current.runPythonAsync("sys.stdout.getvalue()");
      setOutputConsole(stdout + "\n[SUCESSO] Todos os testes passaram!");
      setEvaluationSuccess(true);
      setMascotMood('happy');
      playSound('success');

      // Adicionar XP e Moedas
      setXp(prev => prev + 25);
      setCoins(prev => prev + 5);

      // Desbloquear próxima lição se aplicável
      const currentIdx = LESSONS_DATABASE.findIndex(l => l.id === currentLesson.id);
      if (currentIdx !== -1 && currentIdx < LESSONS_DATABASE.length - 1) {
        const nextLesson = LESSONS_DATABASE[currentIdx + 1];
        if (!unlockedLessons.includes(nextLesson.id)) {
          setUnlockedLessons(prev => [...prev, nextLesson.id]);
        }
      }

      if (!completedLessons.includes(currentLesson.id)) {
        setCompletedLessons(prev => [...prev, currentLesson.id]);
      }

    } catch (err) {
      setEvaluationSuccess(false);
      setMascotMood('sad');
      playSound('error');
      
      // Remover uma vida
      setHearts(prev => Math.max(0, prev - 1));

      // Extrair mensagem do erro Python para criar Feedback Socrático
      let errMsg = err.message;
      let suggestion = currentLesson.hint;

      if (errMsg.includes("AssertionError")) {
        const match = errMsg.match(/AssertionError:\s*(.*)/);
        if (match && match[1]) {
          suggestion = `Dica do Tutor: ${match[1]}`;
        }
      } else if (errMsg.includes("NameError")) {
        suggestion = `Dica do Tutor: Você está chamando ou utilizando algo que não foi definido. Veja se escreveu nomes de variáveis corretos.`;
      } else if (errMsg.includes("SyntaxError")) {
        suggestion = `Dica do Tutor: Há um erro gramatical no seu código Python. Lembre-se de fechar parênteses, aspas ou verificar os dois pontos (:) em condicionais.`;
      } else if (errMsg.includes("IndentationError")) {
        suggestion = `Dica do Tutor: Lembre-se que o Python é muito rigoroso com a indentação (espaçamento inicial das linhas).`;
      }

      setExecutionError(errMsg);
      setSocraticFeedback(suggestion);
    } finally {
      setIsEvaluating(false);
    }
  };

  // --- REGENERAR CORAÇÃO ---
  const buyHeart = () => {
    playSound('click');
    if (coins >= 20 && hearts < 5) {
      setCoins(prev => prev - 20);
      setHearts(prev => prev + 1);
      setMascotMood('happy');
      setTimeout(() => setMascotMood('thinking'), 1500);
    }
  };

  // --- REINICIAR JORNADA ---
  const resetProgress = () => {
    playSound('click');
    setXp(0);
    setHearts(5);
    setCoins(10);
    setUnlockedLessons(['f1_l1']);
    setCompletedLessons([]);
    setMascotMood('thinking');
    setCurrentLesson(null);
  };

  // Renderizador SVG do Mascote "Lingo" Reativo
  const renderMascotSVG = (mood, size = "h-40 w-40") => {
    let eyeColor = "#1e293b";
    let bodyColor = "#22c55e"; // emerald-500
    let tongueColor = "#f43f5e"; // rose-500
    let jawHeight = 4;
    let eyebrowRotationLeft = "0deg";
    let eyebrowRotationRight = "0deg";
    let cheekBlush = false;
    let customElements = null;

    if (mood === 'happy') {
      jawHeight = 12;
      cheekBlush = true;
      customElements = (
        <g id="party-accessories">
          {/* Sparkles / Confetes ao redor */}
          <circle cx="15" cy="20" r="2" fill="#eab308" className="animate-ping" />
          <circle cx="140" cy="25" r="3" fill="#3b82f6" className="animate-ping" />
          <path d="M120,15 L125,22 M125,15 L120,22" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    } else if (mood === 'sad') {
      eyeColor = "#475569";
      eyebrowRotationLeft = "15deg";
      eyebrowRotationRight = "-15deg";
      customElements = (
        <g id="sad-accessories">
          {/* Lágrima pequena */}
          <path d="M48,65 Q45,72 48,75 Q52,75 51,70 Z" fill="#38bdf8" className="animate-bounce" />
        </g>
      );
    } else if (mood === 'geek') {
      customElements = (
        <g id="geek-sunglasses">
          {/* Óculos escuros estilo Sênior */}
          <rect x="25" y="45" width="40" height="15" rx="5" fill="#0f172a" />
          <rect x="75" y="45" width="40" height="15" rx="5" fill="#0f172a" />
          <line x1="65" y1="52" x2="75" y2="52" stroke="#0f172a" strokeWidth="5" />
          {/* Hastes */}
          <path d="M15,48 L25,48" stroke="#0f172a" strokeWidth="3" />
          <path d="M115,48 L125,48" stroke="#0f172a" strokeWidth="3" />
        </g>
      );
    }

    return (
      <div className={`relative ${size} transition-all duration-300 transform hover:scale-105`}>
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Corpo enrolado do Python */}
          <path d="M20,110 C10,90 20,70 40,70 C60,70 50,110 80,110 C110,110 130,90 125,70 C120,50 100,50 90,60" 
                stroke={bodyColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          
          <path d="M75,130 C120,130 140,110 135,90" 
                stroke="#15803d" strokeWidth="14" strokeLinecap="round" />

          {/* Manchas Decorativas amarelas de Píton */}
          <circle cx="35" cy="85" r="5" fill="#facc15" />
          <circle cx="80" cy="110" r="4" fill="#facc15" />
          <circle cx="115" cy="85" r="5" fill="#facc15" />

          {/* Cabeça do Mascote */}
          <rect x="30" y="25" width="80" height="55" rx="25" fill={bodyColor} />
          
          {/* Sobrancelhas */}
          <line x1="38" y1="38" x2="55" y2="38" stroke="#15803d" strokeWidth="4" strokeLinecap="round" 
                style={{ transform: `rotate(${eyebrowRotationLeft})`, transformOrigin: '46px 38px' }} />
          <line x1="85" y1="38" x2="102" y2="38" stroke="#15803d" strokeWidth="4" strokeLinecap="round" 
                style={{ transform: `rotate(${eyebrowRotationRight})`, transformOrigin: '93px 38px' }} />

          {/* Olhos */}
          {mood !== 'geek' && (
            <>
              <circle cx="48" cy="50" r="8" fill="#ffffff" />
              <circle cx="48" cy="50" r="4" fill={eyeColor} />
              <circle cx="92" cy="50" r="8" fill="#ffffff" />
              <circle cx="92" cy="50" r="4" fill={eyeColor} />
            </>
          )}

          {/* Bochechas Rosadas */}
          {cheekBlush && (
            <>
              <circle cx="38" cy="62" r="5" fill="#f43f5e" opacity="0.5" />
              <circle cx="102" cy="62" r="5" fill="#f43f5e" opacity="0.5" />
            </>
          )}

          {/* Boca e Língua Bifurcada */}
          <rect x="55" y="60" width="30" height={jawHeight} rx="5" fill="#1e293b" />
          <path d="M66,62 L66,74 L62,78 M66,74 L70,78" stroke={tongueColor} strokeWidth="3" strokeLinecap="round" />

          {/* Elementos condicionais baseados no humor */}
          {customElements}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* --- HEADER GLOBAL (STATUS BAR) --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo e Título */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { playSound('click'); setCurrentLesson(null); setActiveTab('tree'); }}>
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-md shadow-emerald-200">
              <svg className="w-6 h-6 transform rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-emerald-500">PyLingo<span className="text-slate-800 text-xs font-semibold ml-1 align-super bg-slate-100 px-1.5 py-0.5 rounded">v2.0</span></span>
          </div>

          {/* Métricas do Perfil */}
          <div className="flex items-center space-x-6">
            
            {/* XP */}
            <div className="flex items-center space-x-1.5 text-blue-500 font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Sparkles className="w-5 h-5 fill-current animate-pulse" />
              <span>{xp} <span className="text-xs text-blue-400 font-medium">XP</span></span>
            </div>

            {/* Ofensiva (Streak) */}
            <div className="flex items-center space-x-1.5 text-amber-500 font-bold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
              <Flame className="w-5 h-5 fill-current animate-bounce" />
              <span>{streak} <span className="text-xs text-amber-400 font-medium">Dias</span></span>
            </div>

            {/* Vidas (Corações) */}
            <div className="flex items-center space-x-1.5 text-rose-500 font-bold bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
              <Heart className={`w-5 h-5 fill-current ${hearts <= 1 ? 'animate-ping' : ''}`} />
              <span>{hearts} / 5</span>
            </div>

            {/* Moedas (LingoCoins) */}
            <div className="flex items-center space-x-1.5 text-yellow-500 font-bold bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
              <Award className="w-5 h-5" />
              <span>{coins} <span className="text-xs text-yellow-400 font-medium">Coins</span></span>
            </div>

            {/* Toggle de Áudio */}
            <button 
              onClick={() => { setSoundEnabled(!soundEnabled); playSound('click'); }}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              title={soundEnabled ? "Mudar para Silencioso" : "Ativar Áudio"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>
          </div>

        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL (DASHBOARD OU LIÇÃO ATIVA) --- */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 md:py-8">
        
        {currentLesson ? (
          // ==================== TELA DE FOCO: LIÇÃO ATIVA & EDITOR (SANDBOX) ====================
          <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
            
            {/* Header da Lição */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => { playSound('click'); setCurrentLesson(null); }}
                  className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">{currentLesson.phaseTitle}</p>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    {currentLesson.title}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      currentLesson.difficulty === 'Fácil' ? 'bg-emerald-950 text-emerald-400' :
                      currentLesson.difficulty === 'Médio' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {currentLesson.difficulty}
                    </span>
                  </h2>
                </div>
              </div>
              
              {/* Interpretador WebAssembly Status */}
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                <div className={`w-2.5 h-2.5 rounded-full ${pyodideReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-spin'}`}></div>
                <span className="font-mono text-slate-300">
                  {pyodideReady ? 'Python WASM Pronto' : 'Inicializando Python...'}
                </span>
              </div>
            </div>

            {/* Painel Bifurcado (Teoria vs. Editor) */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[500px]">
              
              {/* LADO ESQUERDO: Teoria e Instruções (5 colunas) */}
              <div className="lg:col-span-5 border-r border-slate-100 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  
                  {/* Mascote no Canto */}
                  <div className="flex items-center space-x-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                    {renderMascotSVG(mascotMood, "h-20 w-20")}
                    <div>
                      <p className="text-sm italic font-medium text-slate-600">
                        {evaluationSuccess === true && "Excepcional! Seu código está perfeito."}
                        {evaluationSuccess === false && "Ah não! Há um pequeno ajuste a fazer..."}
                        {evaluationSuccess === null && "Olá, Desenvolvedor! Leia a teoria ao lado e codifique a resposta no painel."}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    Micro-Lição
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {currentLesson.description}
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Exemplo em Python:</span>
                    <pre className="text-xs bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto font-mono">
                      {currentLesson.id === 'f1_l1' && 'print("Olá, Mundo!")'}
                      {currentLesson.id === 'f2_l1' && 'idade = 25\nnome = "Lingo"'}
                      {currentLesson.id === 'f2_l2' && 'def dobro(n):\n    return n * 2'}
                      {currentLesson.id === 'f2_l3' && 'def eh_par(n):\n    return n % 2 == 0'}
                      {currentLesson.id === 'f2_l4' && 'def soma_ate(n):\n    total = 0\n    for i in range(1, n+1):\n        total += i\n    return total'}
                    </pre>
                  </div>

                  {/* Instrução em Destaque */}
                  <div className="bg-emerald-50/70 border border-emerald-200/50 rounded-xl p-4 space-y-1.5">
                    <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4" /> Objetivo do Desafio:
                    </span>
                    <p className="text-slate-800 font-bold text-sm leading-relaxed">
                      {currentLesson.instructions}
                    </p>
                  </div>

                </div>

                {/* Status das Vidas */}
                {hearts === 0 && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-center space-y-2">
                    <p className="font-bold text-sm">⚠️ Você ficou sem vidas!</p>
                    <p className="text-xs">Consiga mais vidas na loja usando LingoCoins ou reinicie seu progresso para continuar.</p>
                    <button 
                      onClick={() => setActiveTab('shop')} 
                      className="text-xs bg-rose-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      Ir para a Loja
                    </button>
                  </div>
                )}

              </div>

              {/* LADO DIREITO: Editor e Terminal (7 colunas) */}
              <div className="lg:col-span-7 flex flex-col bg-slate-950 overflow-hidden">
                
                {/* Editor Header */}
                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span>solucao.py</span>
                  </div>
                  <button 
                    onClick={() => { playSound('click'); setCode(currentLesson.codeSkeleton); }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reiniciar Código
                  </button>
                </div>

                {/* Área de Escrita do Editor de Código */}
                <div className="flex-1 flex font-mono text-sm relative">
                  {/* Números das Linhas */}
                  <div className="w-12 bg-slate-900/50 text-slate-600 py-4 text-right pr-3 select-none border-r border-slate-800/50">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  {/* Textarea customizado com cara de IDE */}
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 bg-transparent text-slate-200 p-4 focus:outline-none resize-none font-mono leading-relaxed h-full w-full"
                    placeholder="# Digite seu código Python aqui..."
                    spellCheck="false"
                  />
                </div>

                {/* TERMINAL / SIMULAÇÃO DE OUTPUT */}
                <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col">
                  <div className="px-4 py-2 bg-slate-950 flex items-center text-xs font-mono text-slate-400 border-b border-slate-800">
                    <Terminal className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                    <span>Console de Saída (Standard Output)</span>
                  </div>
                  <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 select-text">
                    {outputConsole && (
                      <pre className="text-emerald-400 whitespace-pre-wrap">{outputConsole}</pre>
                    )}
                    {executionError && (
                      <pre className="text-rose-400 whitespace-pre-wrap">{executionError}</pre>
                    )}
                    {!outputConsole && !executionError && (
                      <span className="text-slate-600 font-italic">Nenhuma saída gerada. Clique em "Executar" para ver os prints.</span>
                    )}
                  </div>
                </div>

                {/* Controle de Execução Lateral */}
                <div className="bg-slate-900/50 p-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button 
                    onClick={executeCodeOnly}
                    disabled={isEvaluating || !pyodideReady}
                    className="px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Rodar Código
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">Pyodide WASM Engine Ativo</span>
                </div>

              </div>

            </div>

            {/* BARRA DE FEEDBACK INFERIOR (Padrão Duolingo) */}
            <div className={`p-6 border-t ${
              evaluationSuccess === true ? 'bg-emerald-50 border-emerald-200' :
              evaluationSuccess === false ? 'bg-rose-50 border-rose-200' :
              'bg-slate-50 border-slate-200'
            } transition-all duration-300`}>
              
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Lado Esquerdo do Feedback */}
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  {evaluationSuccess === true && (
                    <div className="bg-emerald-500 p-3 rounded-full text-white animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  )}
                  {evaluationSuccess === false && (
                    <div className="bg-rose-500 p-3 rounded-full text-white">
                      <Heart className="w-8 h-8 fill-current" />
                    </div>
                  )}

                  <div>
                    {evaluationSuccess === true && (
                      <div>
                        <h4 className="text-lg font-black text-emerald-800">Incrível! Resposta correta!</h4>
                        <p className="text-emerald-700 text-sm font-semibold">+25 XP obtidos • +5 LingoCoins</p>
                      </div>
                    )}
                    {evaluationSuccess === false && (
                      <div className="space-y-1">
                        <h4 className="text-lg font-black text-rose-800 font-mono">Falha em algum teste!</h4>
                        <p className="text-rose-700 text-xs max-w-lg leading-relaxed whitespace-pre-line font-medium bg-white/70 p-2.5 rounded-lg border border-rose-100">
                          {socraticFeedback}
                        </p>
                      </div>
                    )}
                    {evaluationSuccess === null && (
                      <p className="text-slate-500 text-sm font-medium">Lembre-se de verificar seu código usando testes automatizados para progredir na árvore.</p>
                    )}
                  </div>
                </div>

                {/* Botão de Ação do Feedback */}
                <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                  {evaluationSuccess === true ? (
                    <button 
                      onClick={() => { playSound('click'); setCurrentLesson(null); }}
                      className="w-full md:w-auto px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow-md shadow-emerald-200 active:translate-y-0.5 transition-all text-center"
                    >
                      Continuar Jornada
                    </button>
                  ) : evaluationSuccess === false ? (
                    <button 
                      onClick={handleVerifyLesson}
                      disabled={hearts === 0}
                      className="w-full md:w-auto px-8 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 disabled:opacity-50 shadow-md shadow-rose-200 active:translate-y-0.5 transition-all text-center"
                    >
                      Tentar Novamente
                    </button>
                  ) : (
                    <button 
                      onClick={handleVerifyLesson}
                      disabled={hearts === 0}
                      className="w-full md:w-auto px-10 py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 active:translate-y-0.5 transition-all text-center"
                    >
                      Verificar Desafio
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
        ) : (
          // ==================== TELA PRINCIPAL: ÁRVORE DE APRENDIZADO ====================
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* PAINEL LATERAL ESQUERDO: Mascote & Status (4 colunas) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm">
                
                {/* Visualização Dinâmica do Mascote */}
                <div className="bg-slate-50 rounded-2xl p-6 w-full flex flex-col items-center border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Nível 1 (Iniciante)
                  </div>
                  {renderMascotSVG(mascotMood, "h-40 w-40")}
                  <h3 className="text-xl font-extrabold text-slate-800 mt-4">Lingo, o Tutor</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-xs mt-1">
                    "Escreva código Python limpo e eu irei comemorar com você! Cuidado para não errar e machucar meus sentimentos."
                  </p>
                </div>

                {/* Painel de Navegação de Abas */}
                <div className="w-full mt-6 grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => { playSound('click'); setActiveTab('tree'); }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      activeTab === 'tree' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Árvore
                  </button>
                  
                  <button 
                    onClick={() => { playSound('click'); setActiveTab('sandbox'); }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      activeTab === 'sandbox' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    Sandbox
                  </button>
                  
                  <button 
                    onClick={() => { playSound('click'); setActiveTab('shop'); }}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      activeTab === 'shop' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    Loja
                  </button>
                </div>

              </div>

              {/* Box de Estatísticas de Desempenho */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-extrabold text-slate-700 tracking-wider uppercase">Seu Progresso</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Lições Concluídas</span>
                      <span>{completedLessons.length} / {LESSONS_DATABASE.length}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div 
                        className="bg-emerald-500 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(completedLessons.length / LESSONS_DATABASE.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-600">Pontuação Total:</span>
                    <span className="font-mono font-bold text-emerald-600">{xp} XP</span>
                  </div>
                </div>
              </div>

            </div>

            {/* PAINEL CENTRAL DIREITO: Visualização da Aba Selecionada (8 colunas) */}
            <div className="lg:col-span-8">
              
              {activeTab === 'tree' && (
                // ABA: ÁRVORE DE APRENDIZADO
                <div className="space-y-8 pb-12">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-800">A Trilha de Aprendizagem Python</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Complete cada lição com perfeição técnica para liberar novos ramos e evoluir. Comece no zero absoluto e chegue ao nível sênior!
                    </p>
                  </div>

                  {/* Fluxo Vertical dos Nós */}
                  <div className="relative flex flex-col items-center">
                    
                    {/* Linha traseira que conecta visualmente os nós */}
                    <div className="absolute top-8 bottom-8 w-1 bg-slate-200 left-1/2 transform -translate-x-1/2 z-0"></div>

                    {LESSONS_DATABASE.map((lesson, idx) => {
                      const isUnlocked = unlockedLessons.includes(lesson.id);
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrentlyPlayable = isUnlocked && !isCompleted;

                      return (
                        <div key={lesson.id} className="relative z-10 w-full max-w-md flex flex-col items-center my-6">
                          
                          {/* Separador de Fases (Quando muda de Fase no Roadmap) */}
                          {(idx === 0 || LESSONS_DATABASE[idx - 1].phase !== lesson.phase) && (
                            <div className="bg-slate-800 text-white text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest shadow border border-slate-700">
                              Fase {lesson.phase}: {lesson.phaseTitle}
                            </div>
                          )}

                          {/* O Botão/Nó do Curso */}
                          <div 
                            onClick={() => handleSelectLesson(lesson)}
                            className={`w-20 h-20 rounded-full flex items-center justify-between justify-center cursor-pointer transform hover:scale-110 active:scale-95 transition-all shadow-lg ${
                              isCompleted ? 'bg-emerald-500 border-4 border-emerald-300 text-white shadow-emerald-100' :
                              isCurrentlyPlayable ? 'bg-emerald-400 border-4 border-emerald-200 text-white animate-pulse' :
                              'bg-slate-200 border-4 border-slate-300 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-8 h-8" />
                            ) : !isUnlocked ? (
                              <Lock className="w-8 h-8" />
                            ) : (
                              <Code2 className="w-8 h-8" />
                            )}
                          </div>

                          {/* Descrição do Nó */}
                          <div className="mt-3 text-center bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm max-w-[280px]">
                            <h4 className="text-sm font-bold text-slate-800">{lesson.title}</h4>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {isCompleted ? 'Completo! Pratique de novo.' :
                               isUnlocked ? 'Clique para iniciar!' : 'Bloqueado'}
                            </p>
                          </div>

                        </div>
                      );
                    })}

                    {/* Fases Adicionais (Bloqueadas para demonstração) */}
                    <div className="w-full max-w-md flex flex-col items-center opacity-40 select-none my-6">
                      <div className="bg-slate-300 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                        Fases Futuras (Em breve)
                      </div>
                      <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 mt-2">POO & Algoritmos Complexos</span>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'sandbox' && (
                // ABA: SANDBOX LIVRE
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-800">Modo Sandbox Livre</h2>
                      <p className="text-xs text-slate-500">
                        Um ambiente de experimentação pura. Digite e teste qualquer código Python sem limitação de vidas ou testes.
                      </p>
                    </div>
                    <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                      Python 3.11 WASM
                    </div>
                  </div>

                  {/* Sandbox Editor */}
                  <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                    <div className="bg-slate-900 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">sandbox.py</span>
                      <button 
                        onClick={() => { setCode('# Escreva qualquer código aqui!\n\nfor i in range(5):\n    print(f"Olá, PyLingo número {i}!")\n'); playSound('click'); }}
                        className="text-xs text-emerald-400 font-mono hover:underline"
                      >
                        Carregar Exemplo
                      </button>
                    </div>

                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-64 bg-transparent text-slate-200 p-4 font-mono text-sm focus:outline-none resize-none leading-relaxed"
                      placeholder="# Brinque à vontade..."
                      spellCheck="false"
                    />

                    {/* Console do Sandbox */}
                    <div className="bg-slate-900 p-4 border-t border-slate-800">
                      <span className="text-xs font-mono text-slate-400 block mb-2">Console:</span>
                      <pre className="text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap min-h-[80px]">
                        {outputConsole || "O output do console será impresso aqui ao clicar em Executar."}
                      </pre>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={executeCodeOnly}
                      disabled={!pyodideReady}
                      className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 shadow transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-4 h-4" /> Executar Código Livre
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'shop' && (
                // ABA: LOJA DE ITENS E CONFIGURAÇÕES
                <div className="space-y-6">
                  
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-800">Loja do Lingo</h2>
                    <p className="text-xs text-slate-500">
                      Troque suas moedas acumuladas por vantagens para impulsionar seu aprendizado!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Item: Comprar Vida */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="bg-rose-100 text-rose-500 p-3 rounded-2xl w-fit">
                          <Heart className="w-8 h-8 fill-current" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mt-4">Comprar 1 Vida</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Recupere um coração para continuar resolvendo desafios imediatamente sem bloqueios.
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="font-extrabold text-slate-700">Custo: <span className="text-yellow-500">20 Coins</span></span>
                        <button 
                          onClick={buyHeart}
                          disabled={coins < 20 || hearts >= 5}
                          className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 disabled:opacity-50 transition-colors"
                        >
                          {hearts >= 5 ? 'Vidas Cheias' : 'Adquirir'}
                        </button>
                      </div>
                    </div>

                    {/* Item: Visual Sênior do Mascote */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="bg-slate-100 text-slate-700 p-3 rounded-2xl w-fit">
                          <Glasses className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mt-4">Estilo Sênior</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Dê ao mascote Lingo óculos escuros premium para ele te apoiar com autoridade de engenheiro de software de Big Tech.
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="font-extrabold text-slate-700">Custo: <span className="text-yellow-500">Grátis</span></span>
                        <button 
                          onClick={() => { playSound('click'); setMascotMood(mascotMood === 'geek' ? 'thinking' : 'geek'); }}
                          className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
                        >
                          {mascotMood === 'geek' ? 'Desativar Estilo' : 'Equipar'}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Configurações Avançadas */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-800">Zona de Controle</h3>
                    <p className="text-xs text-slate-500">
                      Cuidado: reiniciar o progresso irá resetar toda a sua árvore de aprendizado, XP, Coins e vidas de volta para o início.
                    </p>
                    <div className="pt-2">
                      <button 
                        onClick={resetProgress}
                        className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors"
                      >
                        Reiniciar Progresso do PyLingo
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* --- FOOTER / NOTA DA TECNOLOGIA --- */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© 2026 PyLingo Inc. Construído para capacitação real em Engenharia de Software.</span>
          <div className="flex items-center space-x-2">
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">WebAssembly (Pyodide) Executing</span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">Duolingo Gamified Pattern</span>
          </div>
        </div>
      </footer>

    </div>
  );
}