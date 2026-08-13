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
    <div className="space-y-6 select-none">
      {/* Welcome box */}
      <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 shadow-warm-sm">
        <h2 className="text-xl font-bold text-bioma-moss">Loja do Lingo v2.0</h2>
        <p className="text-xs text-bioma-muted mt-1.5 leading-relaxed font-medium">
          Troque suas LingoCoins conquistadas com dedicação por passes de dicas avançadas ou estilos cosméticos para o mascote Lingo!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item: Passe de Dicas — costs 35 coins */}
        <div className="bg-bioma-card border border-bioma-border rounded-organic-md p-6 flex flex-col justify-between hover:shadow-warm-md transition-shadow">
          <div>
            <div className="bg-bioma-amber-soft text-bioma-amber p-3.5 rounded-organic-sm w-fit border border-bioma-amber/30">
              <Lightbulb className="w-8 h-8 fill-bioma-amber text-bioma-amber" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <h3 className="text-lg font-bold text-bioma-bark">Passe de Dicas</h3>
              {hintPassRemaining > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-organic-sm bg-bioma-leaf-light text-bioma-leaf border border-bioma-leaf/20">
                  {hintPassRemaining} restantes
                </span>
              )}
            </div>
            <p className="text-xs text-bioma-muted mt-1.5 leading-relaxed font-medium">
              Receba acesso a 5 lições com Dica Nível 3 (Passo a Passo) ativada sem sofrer a penalidade de -10% de XP.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-bioma-border flex items-center justify-between">
            <span className="font-bold text-bioma-bark text-sm">
              Preço: <span className="text-bioma-amber">35 Coins</span>
            </span>
            <PrimaryButton3D
              variant="amber"
              onClick={onBuyHintPass}
              disabled={coins < 35}
            >
              Adquirir Passe
            </PrimaryButton3D>
          </div>
        </div>

        {/* Item: Equip "Senior" style (Geek sunglasses) — FREE */}
        <div className="bg-bioma-card border border-bioma-border rounded-organic-md p-6 flex flex-col justify-between hover:shadow-warm-md transition-shadow">
          <div>
            <div className="bg-bioma-sand text-bioma-bark p-3.5 rounded-organic-sm w-fit border border-bioma-border">
              <Glasses className="w-8 h-8 text-bioma-moss" />
            </div>
            <h3 className="text-lg font-bold text-bioma-bark mt-4">Estilo Sênior</h3>
            <p className="text-xs text-bioma-muted mt-1.5 leading-relaxed font-medium">
              Equipe o mascote Lingo com óculos escuros de desenvolvedor sênior de Big Tech.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-bioma-border flex items-center justify-between">
            <span className="font-bold text-bioma-bark text-sm">
              Preço: <span className="text-bioma-leaf font-bold">Grátis</span>
            </span>
            <PrimaryButton3D
              variant="sand"
              onClick={onToggleGeekMood}
            >
              {mascotMood === 'geek' ? 'Desequipar' : 'Equipar'}
            </PrimaryButton3D>
          </div>
        </div>

        {/* Item: Estilo Cientista */}
        <div className="bg-bioma-card border border-bioma-border rounded-organic-md p-6 flex flex-col justify-between hover:shadow-warm-md transition-shadow">
          <div>
            <div className="bg-bioma-leaf-light text-bioma-leaf p-3.5 rounded-organic-sm w-fit border border-bioma-leaf/30">
              <TestTube className="w-8 h-8 text-bioma-leaf" />
            </div>
            <h3 className="text-lg font-bold text-bioma-bark mt-4">Lingo Cientista</h3>
            <p className="text-xs text-bioma-muted mt-1.5 leading-relaxed font-medium">
              Mascote no estilo cientista de dados e inteligência artificial.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-bioma-border flex items-center justify-between">
            <span className="font-bold text-bioma-bark text-sm">
              Preço: <span className="text-bioma-amber">50 Coins</span>
            </span>
            <PrimaryButton3D
              variant="leaf"
              disabled={coins < 50}
            >
              Adquirir
            </PrimaryButton3D>
          </div>
        </div>

        {/* Item: Estilo Músico */}
        <div className="bg-bioma-card border border-bioma-border rounded-organic-md p-6 flex flex-col justify-between hover:shadow-warm-md transition-shadow">
          <div>
            <div className="bg-bioma-amber-soft text-bioma-amber p-3.5 rounded-organic-sm w-fit border border-bioma-amber/30">
              <Music className="w-8 h-8 text-bioma-amber" />
            </div>
            <h3 className="text-lg font-bold text-bioma-bark mt-4">Lingo Músico</h3>
            <p className="text-xs text-bioma-muted mt-1.5 leading-relaxed font-medium">
              Estilo criativo com fones de ouvido para codificar ouvindo lo-fi.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-bioma-border flex items-center justify-between">
            <span className="font-bold text-bioma-bark text-sm">
              Preço: <span className="text-bioma-amber">50 Coins</span>
            </span>
            <PrimaryButton3D
              variant="amber"
              disabled={coins < 50}
            >
              Adquirir
            </PrimaryButton3D>
          </div>
        </div>
      </div>

      {/* Danger zone: Reset progress */}
      <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 shadow-warm-sm space-y-4">
        <h3 className="text-sm font-bold text-bioma-clay uppercase tracking-wider flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" /> Zona de Controle
        </h3>
        <p className="text-xs text-bioma-muted leading-relaxed font-medium">
          Deseja reiniciar toda a sua jornada de aprendizado? Isso removerá seu XP acumulado, moedas e histórico de exercícios concluídos. Esta ação é irreversível.
        </p>
        <div className="pt-2">
          <button
            onClick={onResetProgress}
            aria-label="Reiniciar progresso da conta (Ação irreversível)"
            className="px-4 py-2.5 bg-bioma-clay-soft text-bioma-clay border border-bioma-clay/40 font-extrabold text-xs rounded-organic-sm hover:bg-bioma-clay hover:text-white active:scale-95 transition-all cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
          >
            Reiniciar Progresso
          </button>
        </div>
      </div>
    </div>
  );
};
