import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { IExercise } from '../core/types';
import { getChaptersIndex, loadExerciseBatteryData } from '../core/dataLoader';

interface PracticeViewProps {
  completedExercises: string[];
  onSelectExercise: (exercise: IExercise) => void;
  playSound?: (type: 'success' | 'error' | 'click') => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  completedExercises,
  onSelectExercise,
  playSound,
}) => {
  const chapters = getChaptersIndex().chapters;
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [allExercises, setAllExercises] = useState<{ chapterNum: number; chapterTitle: string; exercise: IExercise }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      setIsLoading(true);
      const list: { chapterNum: number; chapterTitle: string; exercise: IExercise }[] = [];
      
      for (const chap of chapters) {
        try {
          const battery = await loadExerciseBatteryData(chap.exerciseBatteryId);
          for (const ex of battery.exercises) {
            list.push({
              chapterNum: chap.number,
              chapterTitle: chap.title,
              exercise: ex,
            });
          }
        } catch (err) {
          console.error(`Erro ao carregar bateria ${chap.exerciseBatteryId}:`, err);
        }
      }

      if (isMounted) {
        setAllExercises(list);
        setIsLoading(false);
      }
    };

    loadAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = allExercises.filter(({ chapterNum, chapterTitle, exercise }) => {
    if (selectedChapterId !== 'all') {
      const chapId = `chapter_${chapterNum}`;
      if (chapId !== selectedChapterId) return false;
    }

    if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) {
      return false;
    }

    const isCompleted = completedExercises.includes(exercise.id);
    if (selectedStatus === 'completed' && !isCompleted) return false;
    if (selectedStatus === 'pending' && isCompleted) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exercise.title.toLowerCase().includes(q);
      const matchConcept = exercise.concept.toLowerCase().includes(q);
      const matchDesc = exercise.description.toLowerCase().includes(q);
      const matchChap = chapterTitle.toLowerCase().includes(q);
      if (!matchTitle && !matchConcept && !matchDesc && !matchChap) return false;
    }

    return true;
  });

  const totalCompleted = allExercises.filter(e => completedExercises.includes(e.exercise.id)).length;
  const progressPercent = allExercises.length > 0 ? Math.round((totalCompleted / allExercises.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-16 select-none font-sans animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-4 sm:p-6 md:p-8 shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-2.5 py-1 font-mono text-[10px] sm:text-xs uppercase font-bold rounded">
            <Dumbbell className="w-3.5 h-3.5" aria-hidden="true" />
            <span>CENTRAL DE PRÁTICA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-base-900 dark:text-base-50">
            Prática & Desafios por Capítulo
          </h2>
          <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 font-medium max-w-xl leading-relaxed">
            Exercite e consolide seus conhecimentos com a bateria completa de 132 exercícios práticos, avaliados em tempo real.
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="w-full md:w-auto bg-base-50 dark:bg-base-800 border-2 border-base-900 dark:border-base-700 p-4 rounded-xl shadow-xs min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span className="text-base-600 dark:text-base-400">Progresso de Exercícios</span>
            <span className="text-accent">{totalCompleted}/{allExercises.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-base-200 dark:bg-base-700 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-accent h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-4 shadow-brutal space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, conceito ou palavra-chave..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-base-50 dark:bg-base-800 border border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Chapter Selector */}
          <select
            value={selectedChapterId}
            onChange={(e) => { playSound?.('click'); setSelectedChapterId(e.target.value); }}
            aria-label="Filtrar por capítulo"
            className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm rounded-lg bg-base-50 dark:bg-base-800 border border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 focus:outline-none focus:ring-2 focus:ring-accent font-medium cursor-pointer"
          >
            <option value="all">Todos os 12 Capítulos</option>
            {chapters.map((chap) => (
              <option key={chap.id} value={chap.id}>
                Capítulo {chap.number}: {chap.title}
              </option>
            ))}
          </select>
        </div>

        {/* Secondary Filters (Difficulty and Status Pills) */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-base-200 dark:border-base-800">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-base-500 font-mono mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Dificuldade:
            </span>
            {['all', 'Fácil', 'Médio', 'Difícil'].map((diff) => (
              <button
                key={diff}
                onClick={() => { playSound?.('click'); setSelectedDifficulty(diff); }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-base-900 dark:bg-base-100 text-white dark:text-base-950 font-bold shadow-xs'
                    : 'bg-base-50 dark:bg-base-800 text-base-600 dark:text-base-400 hover:bg-base-200 dark:hover:bg-base-700 border border-base-200 dark:border-base-700'
                }`}
              >
                {diff === 'all' ? 'Todas' : diff}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all' as const, label: 'Todos' },
              { id: 'pending' as const, label: 'Pendentes' },
              { id: 'completed' as const, label: 'Concluídos' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { playSound?.('click'); setSelectedStatus(id); }}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  selectedStatus === id
                    ? 'bg-accent text-white dark:text-base-950 font-bold shadow-xs'
                    : 'bg-base-50 dark:bg-base-800 text-base-600 dark:text-base-400 hover:bg-base-200 dark:hover:bg-base-700 border border-base-200 dark:border-base-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises List */}
      {isLoading ? (
        <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-12 text-center shadow-brutal flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-base-300 dark:border-base-700 border-t-accent animate-spin" />
          <span className="text-xs font-mono font-bold text-base-500 uppercase">Carregando baterias de exercícios...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-base-100 dark:bg-base-900 border-2 border-base-900 dark:border-base-700 p-8 sm:p-12 text-center shadow-brutal space-y-3">
          <p className="text-sm font-bold text-base-600 dark:text-base-400 font-mono">
            Nenhum exercício encontrado para os filtros selecionados.
          </p>
          <button
            onClick={() => {
              setSelectedChapterId('all');
              setSelectedDifficulty('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-base-900 dark:bg-base-100 text-white dark:text-base-950 text-xs font-bold font-mono rounded-lg hover:opacity-90 transition-opacity"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ chapterNum, exercise }) => {
            const isCompleted = completedExercises.includes(exercise.id);

            return (
              <div
                key={exercise.id}
                role="article"
                className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between select-none ${
                  isCompleted
                    ? 'bg-base-50 dark:bg-base-900/90 border-emerald-600/40 dark:border-emerald-500/40 shadow-xs'
                    : 'bg-base-100 dark:bg-base-900 border-base-900 dark:border-base-700 shadow-brutal hover:-translate-y-0.5'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-base-500 dark:text-base-400 bg-base-200 dark:bg-base-800 px-2 py-0.5 rounded truncate">
                      Cap {chapterNum} • #{exercise.number}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                      exercise.difficulty === 'Fácil'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        : exercise.difficulty === 'Médio'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
                    }`}>
                      {exercise.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-base-900 dark:text-base-50 flex items-center gap-1.5 leading-snug">
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                    <span>{exercise.title}</span>
                  </h3>

                  <p className="text-xs text-base-600 dark:text-base-400 line-clamp-2 leading-relaxed font-normal">
                    {exercise.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-base-200 dark:border-base-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{exercise.xpReward} XP</span>
                  </div>

                  <button
                    onClick={() => {
                      playSound?.('click');
                      onSelectExercise(exercise);
                    }}
                    aria-label={`Resolver exercício: ${exercise.title}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-base-200 dark:bg-base-800 text-base-700 dark:text-base-300 hover:bg-base-300 dark:hover:bg-base-700'
                        : 'bg-accent text-white dark:text-base-950 hover:bg-accent-hover shadow-xs'
                    }`}
                  >
                    <span>{isCompleted ? 'Revisar' : 'Resolver'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
