import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { PrimaryButton3D } from './PrimaryButton3D';

interface MiniQuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  playSound?: (type: 'success' | 'error' | 'click') => void;
}

export const MiniQuiz: React.FC<MiniQuizProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  playSound,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (submitted) return;
    playSound?.('click');
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null || submitted) return;
    setSubmitted(true);
    if (selectedIndex === correctIndex) {
      playSound?.('success');
    } else {
      playSound?.('error');
    }
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div
      role="region"
      aria-label="Mini Quiz de Fixação Teórica"
      className="bg-bioma-sand border border-bioma-border rounded-organic-md p-5 md:p-6 my-4 select-none shadow-warm-sm"
    >
      <div className="flex items-center space-x-2 text-bioma-leaf font-extrabold text-xs uppercase tracking-widest mb-3">
        <HelpCircle className="w-4 h-4" />
        <span>Mini Quiz de Fixação</span>
      </div>

      <h4 className="text-sm md:text-base font-extrabold text-bioma-bark mb-4">{question}</h4>

      <div className="space-y-2.5 mb-4" role="radiogroup" aria-label={question}>
        {options.map((option, idx) => {
          let btnStyle = 'border-bioma-border bg-bioma-card hover:bg-bioma-sand text-bioma-bark font-semibold';

          if (submitted) {
            if (idx === correctIndex) {
              btnStyle = 'border-bioma-leaf bg-bioma-leaf-light text-bioma-moss font-extrabold';
            } else if (idx === selectedIndex) {
              btnStyle = 'border-bioma-clay bg-bioma-clay-soft text-bioma-clay font-extrabold';
            } else {
              btnStyle = 'border-bioma-border bg-bioma-sand-dark text-bioma-muted opacity-60';
            }
          } else if (idx === selectedIndex) {
            btnStyle = 'border-bioma-leaf bg-bioma-leaf-light text-bioma-moss font-extrabold shadow-warm-sm';
          }

          return (
            <button
              key={idx}
              role="radio"
              aria-checked={selectedIndex === idx}
              aria-disabled={submitted}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className={`w-full text-left p-3.5 rounded-organic-sm border text-xs md:text-sm transition-all flex items-center justify-between cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 ${btnStyle}`}
            >
              <span>{option}</span>
              {submitted && idx === correctIndex && <CheckCircle2 className="w-5 h-5 text-bioma-leaf flex-shrink-0 ml-2" />}
              {submitted && idx === selectedIndex && idx !== correctIndex && <XCircle className="w-5 h-5 text-bioma-clay flex-shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <PrimaryButton3D
          variant="leaf"
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          aria-label="Confirmar resposta selecionada no quiz"
          className="w-full"
        >
          Confirmar Resposta
        </PrimaryButton3D>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded-organic-sm border ${isCorrect ? 'bg-bioma-leaf-light border-bioma-leaf/40 text-bioma-moss' : 'bg-bioma-clay-soft border-bioma-clay/40 text-bioma-clay'} text-xs leading-relaxed font-semibold`}
        >
          <p className="font-extrabold mb-1 flex items-center gap-1.5">
            {isCorrect ? '✨ Excelente! Você acertou!' : '❌ Não é bem isso...'}
          </p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};
