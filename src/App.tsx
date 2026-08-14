import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LearningTree } from './components/LearningTree';
import { SandboxFree } from './components/SandboxFree';
import { Shop } from './components/Shop';
import { ActiveLessonView } from './components/ActiveLessonView';
import { BookReader } from './components/BookReader';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import { LessonCompleteModal } from './components/LessonCompleteModal';
import { LevelUpModal } from './components/LevelUpModal';
import { AchievementUnlockedModal } from './components/AchievementUnlockedModal';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useAudio } from './hooks/useAudio';
import { usePyodide } from './hooks/usePyodide';

import { MascotMood, ActiveTab, ILesson, IExercise, IBookChapter, IExerciseBattery, IAchievement, IGameState, ILeitnerState, IXpHistoryItem } from './core/types';
import { getLocalIsoDate, addXpToHistory } from './core/profile';
import { LESSONS_DATABASE } from './core/lessonsData';
import { addXp, deductCoins } from './core/progression';
import { calculateLevel } from './core/leveling';
import { ACHIEVEMENTS_LIST, checkNewAchievements } from './core/achievements';
import { calculateRewardsV2 } from './core/hintEngine';
import { loadChapterData, loadExerciseBatteryData } from './core/dataLoader';
import { migrateStateV1ToV2 } from './core/migration';
import { supabase, isCloudEnabled } from './core/supabaseClient';

export default function App() {
  // --- ESTADO PERSISTENTE (v2.0) ---
  const [xp, setXp] = useLocalStorage<number>('pylingo_xp_v1', 0);
  const [streak, setStreak] = useLocalStorage<number>('pylingo_streak_v1', 1);
  const [coins, setCoins] = useLocalStorage<number>('pylingo_coins_v1', 10);
  const [unlockedLessons, setUnlockedLessons] = useLocalStorage<string[]>('pylingo_unlocked_v1', ['f1_l1']);
  const [completedLessons, setCompletedLessons] = useLocalStorage<string[]>('pylingo_completed_v1', []);

  // Novos campos v2.0
  const [completedExercises, setCompletedExercises] = useLocalStorage<string[]>('pylingo_completed_v2', []);
  const [chaptersRead, setChaptersRead] = useLocalStorage<Record<string, number>>('pylingo_chapters_read_v2', {});
  const [_hintsUsed, setHintsUsed] = useLocalStorage<Record<string, number>>('pylingo_hints_v2', {});
  const [_exerciseAttempts, setExerciseAttempts] = useLocalStorage<Record<string, number>>('pylingo_attempts_v2', {});
  const [hintPassRemaining, setHintPassRemaining] = useLocalStorage<number>('pylingo_hint_pass_v2', 0);

  const [achievements, setAchievements] = useLocalStorage<string[]>('pylingo_achievements_v1', []);
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('pylingo_sound_v1', true);
  const [onboardingDone, setOnboardingDone] = useLocalStorage<boolean>('pylingo_onboarding_v1', false);
  const [leitnerSchedule, setLeitnerSchedule] = useLocalStorage<Record<string, ILeitnerState>>('pylingo_leitner_v1', {});
  const [xpHistory, setXpHistory] = useLocalStorage<IXpHistoryItem[]>('pylingo_xp_history_v1', []);

  // --- MIGRAÇÃO AUTOMÁTICA v1 -> v2 ---
  useEffect(() => {
    const rawHearts = localStorage.getItem('pylingo_hearts_v1');
    if (rawHearts !== null) {
      const legacyState = {
        xp,
        hearts: Number(rawHearts),
        streak,
        coins,
        unlockedLessons,
        completedLessons,
        achievements,
        soundEnabled,
        leitnerSchedule,
        xpHistory,
      };

      const migrated = migrateStateV1ToV2(legacyState);
      if (migrated.coins !== undefined) setCoins(migrated.coins);
      if (migrated.completedExercises) setCompletedExercises(migrated.completedExercises);
      if (migrated.leitnerSchedule) setLeitnerSchedule(migrated.leitnerSchedule);

      localStorage.removeItem('pylingo_hearts_v1');
    }
  }, []);

  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  useEffect(() => {
    const client = supabase;
    if (!isCloudEnabled || !client) return;

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- ENGINE PYODIDE (WASM em Web Worker) ---
  const { ready: pyodideReady, error: pyodideError, runCode } = usePyodide();

  // --- ESTADO TEMPORÁRIO (Navegação & UI) ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('tree');
  const [currentLesson, setCurrentLesson] = useState<ILesson | IExercise | null>(null);
  const [activeChapter, setActiveChapter] = useState<IBookChapter | null>(null);
  const [activeBattery, setActiveBattery] = useState<IExerciseBattery | null>(null);

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

  const { playSound } = useAudio(soundEnabled);

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

  // --- SELEÇÃO E NAVEGAÇÃO DE CAPÍTULOS E EXERCÍCIOS ---
  const handleSelectChapter = async (chapterId: string) => {
    playSound('click');
    try {
      const chapterData = await loadChapterData(chapterId);
      const batteryData = await loadExerciseBatteryData(chapterData.exerciseBatteryId);

      setActiveChapter(chapterData);
      setActiveBattery(batteryData);
      setActiveTab('book');
      setCurrentLesson(null);
    } catch (err) {
      console.error("Erro ao carregar capítulo:", err);
    }
  };

  const handleStartChapterExercises = async (chapterId: string) => {
    playSound('click');
    try {
      const chapterData = activeChapter?.id === chapterId ? activeChapter : await loadChapterData(chapterId);
      const batteryData = activeBattery?.id === chapterData.exerciseBatteryId ? activeBattery : await loadExerciseBatteryData(chapterData.exerciseBatteryId);

      if (batteryData.exercises.length > 0) {
        setCurrentLesson(batteryData.exercises[0]);
      }
    } catch (err) {
      console.error("Erro ao carregar bateria de exercícios:", err);
    }
  };

  const handleChapterReadComplete = (chapterId: string) => {
    setChaptersRead(prev => ({
      ...prev,
      [chapterId]: 1,
    }));
  };

  // --- SISTEMA DE CONQUISTAS ---
  const checkAndTriggerAchievements = (
    updatedXp: number,
    updatedCoins: number,
    updatedCompleted: string[],
    actionFlags?: { sandboxExecuted?: boolean; shopBought?: boolean }
  ) => {
    let currentPendingCoins = updatedCoins;
    const currentPendingAchievements = [...achievements];
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
        hearts: 5,
        unlockedLessons: unlockedLessons,
        activeTab: activeTab,
        currentLessonId: currentLesson ? currentLesson.id : null,
        soundEnabled: soundEnabled,
        leitnerSchedule: leitnerSchedule,
        xpHistory: xpHistory,
      };

      const newDetections = checkNewAchievements(mockState, [...LESSONS_DATABASE]);

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

  const handleBuyHintPass = () => {
    try {
      const nextCoins = deductCoins(coins, 35);
      setCoins(nextCoins);
      setHintPassRemaining(prev => prev + 5);
      setMascotMood('happy');
      playSound('success');

      setTimeout(() => setMascotMood('thinking'), 2000);
      checkAndTriggerAchievements(xp, nextCoins, completedLessons, { shopBought: true });
    } catch (error: any) {
      playSound('error');
      console.warn(error.message);
    }
  };

  const handleToggleGeekMood = () => {
    playSound('click');
    setMascotMood(prev => prev === 'geek' ? 'thinking' : 'geek');
  };

  const handleResetProgress = () => {
    playSound('click');
    if (window.confirm("Você tem certeza absoluta que deseja resetar todo o seu progresso? Isso não poderá ser desfeito.")) {
      setXp(0);
      setStreak(1);
      setCoins(10);
      setUnlockedLessons(['f1_l1']);
      setCompletedLessons([]);
      setCompletedExercises([]);
      setChaptersRead({});
      setHintsUsed({});
      setExerciseAttempts({});
      setHintPassRemaining(0);
      setAchievements([]);
      setLeitnerSchedule({});
      setXpHistory([]);
      setMascotMood('thinking');
      setCurrentLesson(null);
      setActiveChapter(null);
      setActiveBattery(null);
      setSandboxOutput('');
      setActiveTab('tree');
      setModalQueue([]);
      setActiveModal(null);
    }
  };

  const handleSelectLesson = (lesson: ILesson) => {
    playSound('click');
    setCurrentLesson(lesson);
    setMascotMood('thinking');
  };

  const handleLessonSuccess = (attempts: number = 1, maxHintUsed: number = 0) => {
    if (!currentLesson) return;

    const previousLevel = calculateLevel(xp);

    if (maxHintUsed > 0) {
      setHintsUsed(prev => ({ ...prev, [currentLesson.id]: maxHintUsed }));
    }

    const rewards = calculateRewardsV2(
      currentLesson.difficulty,
      maxHintUsed,
      attempts,
      hintPassRemaining > 0
    );

    if (maxHintUsed >= 3 && hintPassRemaining > 0) {
      setHintPassRemaining(prev => Math.max(0, prev - 1));
    }

    const updatedXp = addXp(xp, rewards.xp);
    const updatedCoins = coins + rewards.coins;

    const updatedCompleted = [...completedLessons];
    if (!completedLessons.includes(currentLesson.id)) {
      updatedCompleted.push(currentLesson.id);
    }

    const updatedCompletedExercises = [...completedExercises];
    if (!completedExercises.includes(currentLesson.id)) {
      updatedCompletedExercises.push(currentLesson.id);
    }

    setXp(updatedXp);
    setCoins(updatedCoins);
    setCompletedLessons(updatedCompleted);
    setCompletedExercises(updatedCompletedExercises);

    const hojeStr = getLocalIsoDate(Date.now());
    setXpHistory(prev => addXpToHistory(prev, rewards.xp, hojeStr));

    setMascotMood('happy');

    const newModals: ModalItem[] = [
      {
        type: 'complete',
        data: { xp: rewards.xp, coins: rewards.coins, totalXp: updatedXp }
      }
    ];

    const newLevelVal = calculateLevel(updatedXp);
    if (newLevelVal > previousLevel) {
      newModals.push({
        type: 'level_up',
        data: { level: newLevelVal }
      });
    }

    enqueueModals(newModals);
    checkAndTriggerAchievements(updatedXp, updatedCoins, updatedCompleted);
  };

  const handleLessonFail = (exerciseId?: string) => {
    if (exerciseId) {
      setExerciseAttempts(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
    }
    setMascotMood('sad');
  };

  const handleExecuteSandbox = async () => {
    if (!pyodideReady) return;

    playSound('click');
    setSandboxLoading(true);
    setSandboxOutput("Executando código Python...");

    const res = await runCode(sandboxCode);

    setSandboxLoading(false);
    if (res.error) {
      setSandboxOutput(res.output + (res.output ? "\n\n" : "") + res.error);
    } else {
      setSandboxOutput(res.output || "[Código executado sem saídas padrão (print)]");
    }

    checkAndTriggerAchievements(xp, coins, completedLessons, { sandboxExecuted: true });
  };

  return (
    <div className="min-h-screen bg-base-50 text-base-900 flex flex-col font-mono selection:bg-accent selection:text-base-900">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-base-900 focus:shadow-brutal focus:outline-none focus:ring-4 focus:ring-base-900 font-bold"
      >
        Pular para o conteúdo principal
      </a>
      
      {/* Header Global */}
      <Header
        xp={xp}
        streak={streak}
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
        currentChapter={activeChapter ? { number: activeChapter.number, title: activeChapter.title } : undefined}
      />

      {/* Onboarding Overlay */}
      {!onboardingDone && xp === 0 && completedLessons.length === 0 && (
        <OnboardingOverlay onComplete={() => setOnboardingDone(true)} />
      )}

      {/* Conteúdo Principal */}
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 md:py-8 pb-20 lg:pb-4" data-queue-size={modalQueue.length}>
        
        {pyodideError && (
          <div className="bg-error text-white border-2 border-base-900 shadow-brutal px-4 py-3 mb-6 text-xs font-bold font-mono">
            ⚠️ Ocorreu um erro ao carregar o interpretador Python WASM: {pyodideError}
          </div>
        )}

        <div className="animate-fade-in flex-1 flex flex-col">
          {currentLesson ? (
            <div key="active-lesson" className="animate-slide-up h-full">
              <ActiveLessonView
                exercise={currentLesson}
                onBack={() => setCurrentLesson(null)}
                onSuccess={handleLessonSuccess}
                onFail={() => handleLessonFail(currentLesson.id)}
                soundEnabled={soundEnabled}
                playSound={playSound}
                runCode={runCode}
                pyodideReady={pyodideReady}
                hintPassActive={hintPassRemaining > 0}
              />
            </div>
          ) : activeTab === 'book' && activeChapter ? (
            <div key="active-book" className="animate-slide-up h-full">
              <BookReader
                chapter={activeChapter}
                onChapterReadComplete={handleChapterReadComplete}
                onStartExercises={handleStartChapterExercises}
                onRunCode={runCode}
                onBack={() => setActiveTab('tree')}
                playSound={playSound}
              />
            </div>
          ) : (
            <div key="dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              <div className="hidden lg:block lg:col-span-4">
                <Sidebar
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    playSound('click');
                    setActiveTab(tab);
                    if (tab === 'book' && !activeChapter) {
                      handleSelectChapter('chapter_1');
                    }
                  }}
                  mascotMood={mascotMood}
                  completedLessonsCount={completedLessons.length + completedExercises.length}
                  totalLessonsCount={LESSONS_DATABASE.length + 12}
                  xp={xp}
                  achievements={achievements}
                  leitnerSchedule={leitnerSchedule}
                />
              </div>

              <div className="lg:col-span-8">
                {activeTab === 'tree' && (
                  <LearningTree
                    lessons={LESSONS_DATABASE}
                    unlockedLessons={unlockedLessons}
                    completedLessons={completedLessons}
                    completedExercises={completedExercises}
                    chaptersRead={chaptersRead}
                    onSelectLesson={handleSelectLesson}
                    onSelectChapter={handleSelectChapter}
                    leitnerSchedule={leitnerSchedule}
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
                    mascotMood={mascotMood}
                    onBuyHintPass={handleBuyHintPass}
                    onToggleGeekMood={handleToggleGeekMood}
                    onResetProgress={handleResetProgress}
                    hintPassRemaining={hintPassRemaining}
                  />
                )}

                {activeTab === 'profile' && (
                  <ProfileView
                    xp={xp}
                    streak={streak}
                    completedLessonsCount={completedLessons.length + completedExercises.length}
                    totalLessonsCount={LESSONS_DATABASE.length + 12}
                    achievementsCount={achievements.length}
                    totalAchievementsCount={ACHIEVEMENTS_LIST.length}
                    coins={coins}
                    xpHistory={xpHistory}
                    mascotMood={mascotMood}
                    user={user}
                    onOpenAuth={() => setShowAuthModal(true)}
                    onLogout={async () => {
                      if (supabase) {
                        await supabase.auth.signOut();
                      }
                      setUser(null);
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>

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

      {showAuthModal && (
        <AuthView
          onAuthSuccess={(u) => {
            setUser(u);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
          playSound={playSound}
        />
      )}

      <div className="lg:hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            playSound('click');
            setActiveTab(tab);
            setCurrentLesson(null);
            if (tab === 'book' && !activeChapter) {
              handleSelectChapter('chapter_1');
            }
          }}
          mascotMood={mascotMood}
          completedLessonsCount={completedLessons.length + completedExercises.length}
          totalLessonsCount={LESSONS_DATABASE.length + 12}
          xp={xp}
          achievements={achievements}
          leitnerSchedule={leitnerSchedule}
        />
      </div>

      <footer role="contentinfo" className="bg-base-100 border-t-4 border-base-900 py-6 mt-12 text-center text-xs text-base-900 select-none mb-16 lg:mb-0">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono font-bold">
          <span>© 2026 PyLingo V3 • DEVELOPER EDITION</span>
          <div className="flex items-center space-x-2">
            <span className="bg-base-200 border-2 border-base-900 px-3 py-1 text-[10px] uppercase shadow-pixel-sm">Vite Web Worker</span>
            <span className="bg-accent text-base-900 border-2 border-base-900 px-3 py-1 text-[10px] uppercase shadow-pixel-sm">Pyodide WASM Runtime</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
