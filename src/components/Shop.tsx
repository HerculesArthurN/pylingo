import React from 'react';
import { Heart, Glasses, RotateCcw } from 'lucide-react';
import { HeartsCount, MascotMood } from '../core/types';

interface ShopProps {
  coins: number;
  hearts: HeartsCount;
  mascotMood: MascotMood;
  onBuyHeart: () => void;
  onToggleGeekMood: () => void;
  onResetProgress: () => void;
}

export const Shop: React.FC<ShopProps> = ({
  coins,
  hearts,
  mascotMood,
  onBuyHeart,
  onToggleGeekMood,
  onResetProgress
}) => {
  return (
    <div className="space-y-6 select-none">
      
      {/* Box de boas vindas */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-800">Loja do Lingo</h2>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Troque suas LingoCoins obtidas ao acertar exercícios por corações extras ou roupas para o Lingo!
        </p>
      </div>

      {/* Grid de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Item: Comprar Vida */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="bg-rose-100 text-rose-500 p-3.5 rounded-2xl w-fit border border-rose-200">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mt-4">Recuperar 1 Vida</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Consiga um coração adicional para continuar resolvendo desafios sem bloqueios imediatos.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="font-black text-slate-700 text-sm">
              Preço: <span className="text-amber-500">20 Coins</span>
            </span>
            <button 
              onClick={onBuyHeart}
              disabled={coins < 20 || hearts >= 5}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition-all relative ${
                hearts >= 5
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : coins < 20
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-rose-500 border-b-4 border-rose-700 hover:bg-rose-600 text-white active:border-b-0 active:translate-y-1'
              }`}
            >
              {hearts >= 5 ? 'Vidas Cheias' : 'Adquirir'}
            </button>
          </div>
        </div>

        {/* Item: Equipar Estilo Sênior */}
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

      </div>

      {/* Zona de Perigo / Reinicialização */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" /> Zona de Controle
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Deseja reiniciar toda a sua jornada de aprendizado? Isso removerá o XP, redefinirá vidas para 5, zerará moedas e bloqueará todas as fases anteriores. Esta ação é irreversível.
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
