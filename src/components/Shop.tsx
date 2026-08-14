import React from 'react';
import { Lightbulb, Glasses, RotateCcw, Music, TestTube } from 'lucide-react';
import { MascotMood } from '../core/types';
import { PrimaryButton3D } from './PrimaryButton3D';

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
    <div className="space-y-6 select-none animate-fade-in font-mono">
      {/* Welcome box */}
      <div className="bg-base-100 border-2 border-base-900 p-6 shadow-brutal animate-slide-up">
        <h2 className="text-xl font-bold font-pixel uppercase tracking-tighter text-base-900">Mercado Negro do Lingo</h2>
        <p className="text-[10px] text-base-500 font-bold mt-2 uppercase">
          Troque suas LingoCoins por passes socráticos ou skins ilegais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item: Passe de Dicas */}
        <div role="article" aria-label="Passe de Dicas" className="bg-base-100 border-2 border-base-900 p-6 flex flex-col justify-between hover:bg-base-50 transition-colors shadow-brutal animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <div className="bg-warning text-base-900 p-3 w-fit border-2 border-base-900 shadow-pixel-sm">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <h3 className="text-lg font-bold font-pixel uppercase text-base-900">Passe Socrático</h3>
              {hintPassRemaining > 0 && (
                <span className="text-[10px] font-bold px-2 py-1 bg-accent text-base-900 border-2 border-base-900 shadow-pixel-sm">
                  {hintPassRemaining} RESTANTES
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-base-500 mt-2 uppercase">
              Acesso a 5 lições com Dica Nível 3 ativada sem penalidade de -10% de XP.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-base-900 flex items-center justify-between">
            <span className="font-bold text-base-900 text-xs font-pixel uppercase" aria-label="Preço: 35 LingoCoins">
              Preço: <span className="text-warning">35 LC</span>
            </span>
            <PrimaryButton3D
              variant="amber"
              onClick={onBuyHintPass}
              disabled={coins < 35}
              className="py-2 text-[10px]"
            >
              COMPRAR
            </PrimaryButton3D>
          </div>
        </div>

        {/* Item: Equip "Senior" style (Geek sunglasses) — FREE */}
        <div role="article" aria-label="Skin Dev Sênior" className="bg-base-100 border-2 border-base-900 p-6 flex flex-col justify-between hover:bg-base-50 transition-colors shadow-brutal animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div>
            <div className="bg-base-200 text-base-900 p-3 w-fit border-2 border-base-900 shadow-pixel-sm">
              <Glasses className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-pixel uppercase text-base-900 mt-4">Skin Sênior</h3>
            <p className="text-[10px] font-bold text-base-500 mt-2 uppercase">
              Óculos escuros de dev sênior que já deletou banco de dados em produção.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-base-900 flex items-center justify-between">
            <span className="font-bold text-base-900 text-xs font-pixel uppercase" aria-label="Preço: Grátis">
              Preço: <span className="text-accent">GRÁTIS</span>
            </span>
            <PrimaryButton3D
              variant="sand"
              onClick={onToggleGeekMood}
              className="py-2 text-[10px]"
            >
              {mascotMood === 'geek' ? 'DESEQUIPAR' : 'EQUIPAR'}
            </PrimaryButton3D>
          </div>
        </div>

        {/* Item: Estilo Cientista */}
        <div role="article" aria-label="Lingo Cientista" className="bg-base-100 border-2 border-base-900 p-6 flex flex-col justify-between hover:bg-base-50 transition-colors shadow-brutal animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div>
            <div className="bg-accent text-base-900 p-3 w-fit border-2 border-base-900 shadow-pixel-sm">
              <TestTube className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-pixel uppercase text-base-900 mt-4">Data Scientist</h3>
            <p className="text-[10px] font-bold text-base-500 mt-2 uppercase">
              Skin bloqueada. Requer nível 10 em Machine Learning.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-base-900 flex items-center justify-between">
            <span className="font-bold text-base-900 text-xs font-pixel uppercase" aria-label="Preço: 50 LingoCoins">
              Preço: <span className="text-warning">50 LC</span>
            </span>
            <PrimaryButton3D
              variant="leaf"
              disabled={true}
              className="py-2 text-[10px]"
            >
              BLOQUEADO
            </PrimaryButton3D>
          </div>
        </div>

        {/* Item: Estilo Músico */}
        <div role="article" aria-label="Lingo Músico" className="bg-base-100 border-2 border-base-900 p-6 flex flex-col justify-between hover:bg-base-50 transition-colors shadow-brutal animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div>
            <div className="bg-info text-base-900 p-3 w-fit border-2 border-base-900 shadow-pixel-sm">
              <Music className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-pixel uppercase text-base-900 mt-4">Lo-fi Coder</h3>
            <p className="text-[10px] font-bold text-base-500 mt-2 uppercase">
              Skin bloqueada. Fones de ouvido para codar ao som de lofi beats.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t-2 border-base-900 flex items-center justify-between">
            <span className="font-bold text-base-900 text-xs font-pixel uppercase" aria-label="Preço: 50 LingoCoins">
              Preço: <span className="text-warning">50 LC</span>
            </span>
            <PrimaryButton3D
              variant="amber"
              disabled={true}
              className="py-2 text-[10px]"
            >
              BLOQUEADO
            </PrimaryButton3D>
          </div>
        </div>
      </div>

      {/* Danger zone: Reset progress */}
      <div className="bg-error text-white border-2 border-base-900 p-6 shadow-brutal space-y-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-sm font-bold font-pixel uppercase tracking-tighter flex items-center gap-2">
          <RotateCcw className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-[10px] font-bold leading-relaxed">
          WIPE TOTAL. PERDA DE XP, MOEDAS E PROGRESSO. AÇÃO IRREVERSÍVEL.
        </p>
        <div className="pt-2">
          <button
            onClick={onResetProgress}
            aria-label="Reiniciar progresso da conta (Ação irreversível)"
            className="px-4 py-2 bg-base-900 text-white font-bold font-pixel text-[10px] uppercase border-2 border-white hover:bg-white hover:text-error transition-colors focus-visible:outline focus-visible:outline-2"
          >
            HARD RESET
          </button>
        </div>
      </div>
    </div>
  );
};
