import React from 'react';
import { Lightbulb, Glasses, RotateCcw, Music, TestTube } from 'lucide-react';
import { MascotMood } from '../core/types';

interface ShopProps {
  coins: number;
  mascotMood: MascotMood;
  onBuyHintPass: () => void;
  onToggleGeekMood: () => void;
  onResetProgress: () => void;
  hintPassRemaining: number;
}

export const Shop: React.FC<ShopProps> = ({
  coins,
  mascotMood,
  onBuyHintPass,
  onToggleGeekMood,
  onResetProgress,
  hintPassRemaining,
}) => {
  return (
    <div className="space-y-6 select-none">
      {/* Welcome box */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-800">Loja do Lingo v2.0</h2>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Troque suas LingoCoins conquistadas com dedicação por passes de dicas avançadas ou estilos cosméticos para o mascote Lingo!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item: Passe de Dicas — costs 35 coins */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="bg-amber-100 text-amber-600 p-3.5 rounded-2xl w-fit border border-amber-200">
              <Lightbulb className="w-8 h-8 fill-amber-500 text-amber-500" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <h3 className="text-lg font-black text-slate-800">Passe de Dicas</h3>
              {hintPassRemaining > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {hintPassRemaining} restantes
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Receba acesso a 5 lições com Dica Nível 3 (Passo a Passo) ativada sem sofrer a penalidade de -10% de XP.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="font-black text-slate-700 text-sm">
              Preço: <span className="text-amber-500">35 Coins</span>
            </span>
            <button
              onClick={onBuyHintPass}
              disabled={coins < 35}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all relative ${
                coins < 35
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-amber-500 border-b-4 border-amber-700 hover:bg-amber-600 text-white active:border-b-0 active:translate-y-1'
              }`}
            >
              Adquirir Passe
            </button>
          </div>
        </div>

        {/* Item: Equip "Senior" style (Geek sunglasses) — FREE */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="bg-slate-100 text-slate-700 p-3.5 rounded-2xl w-fit border border-slate-200">
              <Glasses className="w-8 h-8 text-slate-800" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mt-4">Estilo Sênior</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Equipe o mascote Lingo com óculos escuros de desenvolvedor sênior de Big Tech.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="font-black text-slate-700 text-sm">
              Preço: <span className="text-emerald-500 font-bold">Grátis</span>
            </span>
            <button
              onClick={onToggleGeekMood}
              className="px-4 py-2.5 rounded-xl font-black text-xs bg-slate-800 border-b-4 border-slate-950 hover:bg-slate-700 text-white active:border-b-0 active:translate-y-1 transition-all"
            >
              {mascotMood === 'geek' ? 'Desequipar' : 'Equipar'}
            </button>
          </div>
        </div>

        {/* Item: Estilo Cientista */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="bg-blue-100 text-blue-600 p-3.5 rounded-2xl w-fit border border-blue-200">
              <TestTube className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mt-4">Lingo Cientista</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Mascote no estilo cientista de dados e inteligência artificial.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="font-black text-slate-700 text-sm">
              Preço: <span className="text-amber-500">50 Coins</span>
            </span>
            <button
              disabled={coins < 50}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all ${
                coins < 50
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-blue-600 border-b-4 border-blue-800 hover:bg-blue-700 text-white active:border-b-0 active:translate-y-1'
              }`}
            >
              Adquirir
            </button>
          </div>
        </div>

        {/* Item: Estilo Músico */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="bg-purple-100 text-purple-600 p-3.5 rounded-2xl w-fit border border-purple-200">
              <Music className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mt-4">Lingo Músico</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Estilo criativo com fones de ouvido para codificar ouvindo lo-fi.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="font-black text-slate-700 text-sm">
              Preço: <span className="text-amber-500">50 Coins</span>
            </span>
            <button
              disabled={coins < 50}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all ${
                coins < 50
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-purple-600 border-b-4 border-purple-800 hover:bg-purple-700 text-white active:border-b-0 active:translate-y-1'
              }`}
            >
              Adquirir
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone: Reset progress */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" /> Zona de Controle
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Deseja reiniciar toda a sua jornada de aprendizado? Isso removerá seu XP acumulado, moedas e histórico de exercícios concluídos. Esta ação é irreversível.
        </p>
        <div className="pt-2">
          <button
            onClick={onResetProgress}
            className="px-4 py-2.5 bg-rose-50 text-rose-600 border-2 border-rose-200 font-bold text-xs rounded-xl hover:bg-rose-100 active:scale-95 transition-all"
          >
            Reiniciar Progresso
          </button>
        </div>
      </div>
    </div>
  );
};
