import { IBookChapter, IExerciseBattery, IInterviewChallenge } from './types';
import chaptersIndexData from '../data/chapters_index.json';
import leetCodeData from '../data/interview_leetcode_challenges.json';
import backendData from '../data/interview_backend_challenges.json';

export interface IChaptersIndexMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  estimatedMinutes: number;
  exerciseCount: number;
  exerciseBatteryId: string;
  prerequisites: string[];
}

export interface IChaptersIndex {
  version: string;
  chapters: IChaptersIndexMeta[];
}

/**
 * Retorna o manifesto leve de capítulos carregado no boot.
 */
export function getChaptersIndex(): IChaptersIndex {
  return chaptersIndexData as IChaptersIndex;
}

/**
 * Retorna os desafios de preparação para entrevista LeetCode.
 */
export function getLeetCodeChallenges(): IInterviewChallenge[] {
  return leetCodeData as IInterviewChallenge[];
}

/**
 * Retorna os desafios práticos de backend.
 */
export function getBackendChallenges(): IInterviewChallenge[] {
  return backendData as IInterviewChallenge[];
}

/**
 * Cache em memória para capítulos já carregados via import() dinâmico.
 */
const chapterCache: Record<string, IBookChapter> = {};
const batteryCache: Record<string, IExerciseBattery> = {};

/**
 * Carrega sob demanda (lazy loading) o arquivo JSON de um capítulo do Livro Interativo.
 *
 * @param chapterId ID do capítulo (ex: "chapter_1")
 */
export async function loadChapterData(chapterId: string): Promise<IBookChapter> {
  if (chapterCache[chapterId]) {
    return chapterCache[chapterId];
  }

  try {
    const data = await import(`../data/chapters/${chapterId}.json`);
    const chapter = (data.default || data) as IBookChapter;
    chapterCache[chapterId] = chapter;
    return chapter;
  } catch (err) {
    throw new Error(`Falha ao carregar capítulo '${chapterId}': ${(err as Error).message}`);
  }
}

/**
 * Carrega sob demanda (lazy loading) a bateria de exercícios de um capítulo.
 *
 * @param batteryId ID da bateria (ex: "battery_ch1")
 */
export async function loadExerciseBatteryData(batteryId: string): Promise<IExerciseBattery> {
  if (batteryCache[batteryId]) {
    return batteryCache[batteryId];
  }

  try {
    const data = await import(`../data/exercises/${batteryId}.json`);
    const battery = (data.default || data) as IExerciseBattery;
    batteryCache[batteryId] = battery;
    return battery;
  } catch (err) {
    throw new Error(`Falha ao carregar bateria de exercícios '${batteryId}': ${(err as Error).message}`);
  }
}

/**
 * Limpa o cache de dados (útil para testes unitários).
 */
export function clearDataLoaderCache() {
  for (const key of Object.keys(chapterCache)) {
    delete chapterCache[key];
  }
  for (const key of Object.keys(batteryCache)) {
    delete batteryCache[key];
  }
}

