import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LearningTree } from './components/LearningTree';
import { SandboxFree } from './components/SandboxFree';
import { Shop } from './components/Shop';
import { ActiveLessonView } from './components/ActiveLessonView';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { LessonCompleteModal } from './components/LessonCompleteModal';
import { LevelUpModal } from './components/LevelUpModal';
import { AchievementUnlockedModal } from './components/AchievementUnlockedModal';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudio } from './hooks/useAudio';
import { usePyodide } from './hooks/usePyodide';

import { HeartsCount, MascotMood, ActiveTab, ILesson, IAchievement, IGameState } from './core/types';
import { LESSONS_DATABASE } from './core/lessonsData';
import { addXp, deductHeart, addHeart, deductCoins, unlockNextLesson } from './core/progression';
import { calculateLevel } from './core/leveling';
import { ACHIEVEMENTS_LIST, checkNewAchievements } from './core/achievements';

export default function App() {
  // --- ESTADO PERSISTENTE (Casca Imperativa: LocalStorage) ---
  const [xp, setXp] = useLocalStorage<number>('pylingo_xp_v1', 0);
  const [hearts, setHearts] = useLocalStorage<HeartsCount>('pylingo_hearts_v1', 5);
  const [streak, setStreak] = useLocalStorage<number>('pylingo_streak_v1', 1);
  const [coins, setCoins] = useLocalStorage<number>('pylingo_coins_v1', 10);
  const [unlockedLessons, setUnlockedLessons] = useLocalStorage<string[]>('pylingo_unlocked_v1', ['f1_l1']);
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>('pylingo_completed_v1', []);
  const [achievements, setAchievements] = useLocalStorage<string[]>('pylingo_achievements_v1', []);
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('pylingo_sound_v1', true);
  const [onboardingDone, setOnboardingDone] = useLocalStorage<boolean>('pylingo_onboarding_v1', false);

  // --- ENGINE PYODIDE (WASM em Web Worker) ---
  const { ready: pyodideReady, error: pyodideError, runCode } = usePyodide();


  // --- ESTADO TEMPORÁRIO (Navegação & UI) ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('tree');
  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [sandboxCode, setSandboxCode] = useState<string>('# Escreva qualquer código aqui!\n\nfor i in range(5):\n    print(f"Olá, PyLingo número {i}!")\n');
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);

  // --- FILA DE MODAIS SEQUENCIAL (FIFO) ---
  interface ModalItem {
    type: 'complete' | 'level_up' | 'achievement';
    data: any;
  }

  const [modalQueue, setModalQueue] = useState<ModalItem[]>([]);
  const [activeModal, setActiveModal] = useState<ModalItem | null>(null);

  // --- EFEITOS SONOROS (Audio hook) ---
  const { playSound } = useAudio(soundEnabled);

  // --- ENFILEIRAR E GERENCIAR MODAIS ---
  const enqueueModals = (items: ModalItem[]) => {
    if (items.length === 0) return;

    setModalQueue(prev => {
      const fullQueue = [...prev, ...items];
      setActiveModal(currentActive => {
        if (currentActive === null) {
          const next = fullQueue.shift();
          return next || null;
        }
        return currentActive;
      });
      return fullQueue;
    });
  };

  // --- FECHAR MODAL E PROCESSAR PRÓXIMO DA FILA ---
  const handleCloseModal = () => {
    playSound('click');
    setModalQueue(prevQueue => {
      if (prevQueue.length > 0) {
        const next = prevQueue[0];
        setActiveModal(next);
        return prevQueue.slice(1);
      } else {
        setActiveModal(null);
        if (currentLesson) {
          setCurrentLesson(null);
        }
        return [];
      }
    });
  };

  // --- SISTEMA DE CONQUISTAS ---
  const checkAndTriggerAchievements = (
    updatedXp: number,
    updatedCoins: number,
    updatedCompleted: string[],
    actionFlags?: { sandboxExecuted?: boolean; shopBought?: boolean }
  ) => {
    let currentPendingCoins = updatedCoins;
    let currentPendingAchievements = [...achievements];
    const newUnlockedAchievements: IAchievement[] = [];

    let sandboxFlag = actionFlags?.sandboxExecuted;
    let shopFlag = actionFlags?.shopBought;

    let searchForAchievements = true;
    while (searchForAchievements) {
      const mockState: IGameState = {
        xp: updatedXp,
        coins: currentPendingCoins,
        streak: streak,
        completedLessons: updatedCompleted,
        achievements: currentPendingAchievements,
        hearts: hearts,
        unlockedLessons: unlockedLessons,
        activeTab: activeTab,
        currentLessonId: currentLesson ? currentLesson.id : null,
        soundEnabled: soundEnabled,
      };

      const newDetections = checkNewAchievements(mockState, [...LESSONS_DATABASE]);

      // Conquistas manuais acionadas por eventos de UI
      if (sandboxFlag && !currentPendingAchievements.includes('sandbox_god')) {
        const sandboxAch = ACHIEVEMENTS_LIST.find(a => a.id === 'sandbox_god');
        if (sandboxAch) newDetections.push(sandboxAch);
      }
      if (shopFlag && !currentPendingAchievements.includes('shop_buyer')) {
        const shopAch = ACHIEVEMENTS_LIST.find(a => a.id === 'shop_buyer');
        if (shopAch) newDetections.push(shopAch);
      }

      if (newDetections.length > 0) {
        for (const ach of newDetections) {
          if (!currentPendingAchievements.includes(ach.id)) {
            currentPendingAchievements.push(ach.id);
            currentPendingCoins += ach.coinReward;
            newUnlockedAchievements.push(ach);
          }
        }
        sandboxFlag = false;
        shopFlag = false;
      } else {
        searchForAchievements = false;
      }
    }

    if (newUnlockedAchievements.length > 0) {
      setAchievements(currentPendingAchievements);
      setCoins(currentPendingCoins);

      const newModals = newUnlockedAchievements.map(ach => ({
        type: 'achievement' as const,
        data: ach
      }));
      enqueueModals(newModals);
    }
  };

  // --- COMPRA DE VIDA (LOJA) ---
  const handleBuyHeart = () => {
    try {
      const nextCoins = deductCoins(coins, 20);
      const nextHearts = addHeart(hearts);

      setCoins(nextCoins);
      setHearts(nextHearts);
      setMascotMood('happy');
      playSound('success');

      setTimeout(() => setMascotMood('thinking'), 2000);
      checkAndTriggerAchievements(xp, nextCoins, completedLessons, { shopBought: true });
    } catch (error: any) {
      playSound('error');
      console.warn(error.message);
    }
  };

  // --- EQUIPAR ÓCULOS (Mascote Geek) ---
  const handleToggleGeekMood = () => {
    playSound('click');
    setMascotMood(prev => prev === 'geek' ? 'thinking' : 'geek');
  };

  // --- REINICIAR PROGRESSO (ZONA DE PERIGO) ---
  const handleResetProgress = () => {
    playSound('click');
    if (window.confirm("Você tem certeza absoluta que deseja resetar todo o seu progresso? Isso não poderá ser desfeito.")) {
      setXp(0);
      setHearts(5);
      setStreak(1);
      setCoins(10);
      setUnlockedLessons(['f1_l1']);
      setCompletedLessons([]);
      setAchievements([]);
      setMascotMood('thinking');
      setCurrentLesson(null);
      setSandboxOutput('');
      setActiveTab('tree');
      setModalQueue([]);
      setActiveModal(null);
    }
  };

  // --- SELECIONAR LIÇÃO NA ÁRVORE ---
  const handleSelectLesson = (lesson: ILesson) => {
    playSound('click');
    setCurrentLesson(lesson);
    setMascotMood('thinking');
  };

  // --- CONCLUSÃO DE LIÇÃO COM SUCESSO ---
  const handleLessonSuccess = () => {
    if (!currentLesson) return;

    // Captura nível antes da atualização de XP
    const previousLevel = calculateLevel(xp);

    // Regras de negócio puras aplicadas no core
    const updatedXp = addXp(xp, 25);
    const updatedCoins = coins + 5;

    let updatedCompleted = [...completedLessons];
    if (!completedLessons.includes(currentLesson.id)) {
      updatedCompleted.push(currentLesson.id);
    }

    setXp(updatedXp);
    setCoins(updatedCoins);
    setCompletedLessons(updatedCompleted);

    // Desbloqueia a próxima lição sequencial
    const currentIndex = LESSONS_DATABASE.findIndex(l => l.id === currentLesson.id);
    if (currentIndex !== -1 && currentIndex < LESSONS_DATABASE.length - 1) {
      const nextLesson = LESSONS_DATABASE[currentIndex + 1];
      const updatedUnlocked = unlockNextLesson(unlockedLessons, nextLesson.id);
      setUnlockedLessons(updatedUnlocked);
    }

    setMascotMood('happy');

    // Prepara a sequência de modais da lição
    const newModals: ModalItem[] = [];

    // 1. Modal de Conclusão da Lição
    newModals.push({
      type: 'complete',
      data: { xp: 25, coins: 5, totalXp: updatedXp }
    });

    // 2. Modal de Level Up (se houver)
    const newLevelVal = calculateLevel(updatedXp);
    if (newLevelVal > previousLevel) {
      newModals.push({
        type: 'level_up',
        data: { level: newLevelVal }
      });
    }

    enqueueModals(newModals);

    // Verifica conquistas com valores atualizados
    checkAndTriggerAchievements(updatedXp, updatedCoins, updatedCompleted);
  };

  // --- FALHA DE LIÇÃO (PERDA DE VIDA) ---
  const handleLessonFail = () => {
    try {
      const updatedHearts = deductHeart(hearts);
      setHearts(updatedHearts);
      setMascotMood('sad');
    } catch (error: any) {
      // Vidas já estão zeradas
      setMascotMood('sad');
      console.warn(error.message);
    }
  };

  // --- EXECUÇÃO DO SANDBOX LIVRE ---
  const handleExecuteSandbox = async () => {
    if (!pyodideReady) return;

    playSound('click');
    setSandboxLoading(true);
    setSandboxOutput("Executando código Python...");

    const res = await runCode(sandboxCode);

    setSandboxLoading(false);
    if (res.error) {
      // Exibe erros de sintaxe ou timeouts em destaque
      setSandboxOutput(res.output + (res.output ? "\n\n" : "") + res.error);
    } else {
      setSandboxOutput(res.output || "[Código executado sem saídas padrão (print)]");
    }

    // Verifica conquista de sandbox
    checkAndTriggerAchievements(xp, coins, completedLessons, { sandboxExecuted: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200">
      
      {/* Header Global */}
      <Header
        xp={xp}
        streak={streak}
        hearts={hearts}
        coins={coins}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          playSound('click');
          setSoundEnabled(prev => !prev);
        }}
        onLogoClick={() => {
          playSound('click');
          setCurrentLesson(null);
          setActiveTab('tree');
        }}
      />

      {/* Onboarding Overlay — exibido apenas para novos utilizadores */}
      {!onboardingDone && xp === 0 && completedLessons.length === 0 && (
        <OnboardingOverlay onComplete={() => setOnboardingDone(true)} />
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 md:py-8 pb-20 lg:pb-4" data-queue-size={modalQueue.length}>
        
        {/* Banner de erro de inicialização do Pyodide */}
        {pyodideError && (
          <div className="bg-rose-100 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl mb-6 text-xs font-bold font-mono">
            ⚠️ Ocorreu um erro ao carregar o interpretador Python WASM: {pyodideError}
          </div>
        )}

        {/* ── Transição de tela com AnimatePresence ── */}
        <AnimatePresence mode="wait">
          {currentLesson ? (
            // ── Visualização de Lição Ativa (Modo Foco) ──
            <motion.div
              key="active-lesson"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <ActiveLessonView
                lesson={currentLesson}
                hearts={hearts}
                onBack={() => setCurrentLesson(null)}
                onSuccess={handleLessonSuccess}
                onFail={handleLessonFail}
                soundEnabled={soundEnabled}
                playSound={playSound}
                runCode={runCode}
                pyodideReady={pyodideReady}
              />
            </motion.div>
          ) : (
            // ── Interface Padrão Dashboard (Duas Colunas) ──
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Sidebar Lateral Esquerda (4 colunas — oculta em mobile, a tab bar fica fixa no bottom) */}
              <div className="hidden lg:block lg:col-span-4">
                <Sidebar
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    playSound('click');
                    setActiveTab(tab);
                  }}
                  mascotMood={mascotMood}
                  completedLessonsCount={completedLessons.length}
                  totalLessonsCount={LESSONS_DATABASE.length}
                  xp={xp}
                  achievements={achievements}
                />
              </div>

              {/* Painel Central de Conteúdo (8 colunas) */}
              <div className="lg:col-span-8">
                {activeTab === 'tree' && (
                  <LearningTree
                    lessons={LESSONS_DATABASE}
                    unlockedLessons={unlockedLessons}
                    completedLessons={completedLessons}
                    onSelectLesson={handleSelectLesson}
                  />
                )}

                {activeTab === 'sandbox' && (
                  <SandboxFree
                    code={sandboxCode}
                    onChangeCode={setSandboxCode}
                    output={sandboxOutput}
                    onExecute={handleExecuteSandbox}
                    isLoading={sandboxLoading}
                    pyodideReady={pyodideReady}
                  />
                )}

                {activeTab === 'shop' && (
                  <Shop
                    coins={coins}
                    hearts={hearts}
                    mascotMood={mascotMood}
                    onBuyHeart={handleBuyHeart}
                    onToggleGeekMood={handleToggleGeekMood}
                    onResetProgress={handleResetProgress}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- FILA DE MODAIS SEQUENCIAL (FIFO) --- */}
        {activeModal?.type === 'complete' && (
          <LessonCompleteModal
            xpEarned={activeModal.data.xp}
            coinsEarned={activeModal.data.coins}
            totalXp={activeModal.data.totalXp}
            onContinue={handleCloseModal}
            playSound={playSound}
          />
        )}
        {activeModal?.type === 'level_up' && (
          <LevelUpModal
            newLevel={activeModal.data.level}
            onContinue={handleCloseModal}
            playSound={playSound}
          />
        )}
        {activeModal?.type === 'achievement' && (
          <AchievementUnlockedModal
            achievement={activeModal.data}
            onContinue={handleCloseModal}
            playSound={playSound}
          />
        )}
      </main>

      {/* Tab Bar Mobile — renderizada fora do grid para não ser ocultada pelo hidden lg:block */}
      <div className="lg:hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            playSound('click');
            setActiveTab(tab);
            setCurrentLesson(null);
          }}
          mascotMood={mascotMood}
          completedLessonsCount={completedLessons.length}
          totalLessonsCount={LESSONS_DATABASE.length}
          xp={xp}
          achievements={achievements}
        />
      </div>

      {/* Footer Tecnológico */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 select-none mb-16 lg:mb-0">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© 2026 PyLingo Inc. Projetado para capacitação real em Computação e Python.</span>
          <div className="flex items-center space-x-2">
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold">Vite Web Worker</span>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Pyodide WASM Runtime</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
