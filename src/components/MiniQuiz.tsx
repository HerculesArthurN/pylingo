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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (submitted) return;
    
    let nextIdx = idx;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIdx = (idx + 1) % options.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIdx = (idx - 1 + options.length) % options.length;
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      e.preventDefault();
      const numIdx = parseInt(e.key, 10) - 1;
      if (numIdx < options.length) {
        nextIdx = numIdx;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex !== null) {
        handleSubmit();
      } else {
        handleSelect(idx);
      }
      return;
    }

    if (nextIdx !== idx) {
      handleSelect(nextIdx);
      const el = document.getElementById(`quiz-option-${nextIdx}`);
      el?.focus();
    }
  };

  return (
    <div
      role="region"
      aria-label="Mini Quiz de Fixação Teórica"
      className="bg-base-100 border-2 border-base-900 p-5 md:p-6 my-4 select-none shadow-brutal animate-fade-in font-mono"
    >
      <div className="flex items-center space-x-2 text-base-900 font-pixel text-[10px] uppercase tracking-widest mb-4 bg-accent w-fit px-2 py-1 border-2 border-base-900 shadow-pixel-sm">
        <HelpCircle className="w-4 h-4" />
        <span>QUIZ CHECK</span>
      </div>

      <h4 id="quiz-question-label" className="text-sm md:text-base font-bold text-base-900 mb-4">{question}</h4>

      <div className="space-y-3 mb-4" role="radiogroup" aria-labelledby="quiz-question-label">
        {options.map((option, idx) => {
          let btnStyle = 'border-base-900 bg-base-100 hover:bg-base-200 text-base-900 font-bold';

          if (submitted) {
            if (idx === correctIndex) {
              btnStyle = 'border-base-900 bg-success text-base-900 font-bold shadow-pixel-sm';
            } else if (idx === selectedIndex) {
              btnStyle = 'border-base-900 bg-error text-base-50 font-bold';
            } else {
              btnStyle = 'border-base-900 bg-base-200 text-base-500 opacity-60';
            }
          } else if (idx === selectedIndex) {
            btnStyle = 'border-base-900 bg-base-900 text-accent font-bold shadow-pixel-sm translate-x-1';
          }

          return (
            <button
              id={`quiz-option-${idx}`}
              key={idx}
              role="radio"
              aria-checked={selectedIndex === idx}
              aria-disabled={submitted}
              tabIndex={(!submitted && selectedIndex === idx) || (selectedIndex === null && idx === 0) ? 0 : -1}
              onClick={() => handleSelect(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              disabled={submitted}
              className={`w-full text-left p-3 border-2 text-[10px] md:text-xs transition-all flex items-center justify-between cursor-pointer focus-visible:outline focus-visible:outline-2 ${btnStyle}`}
            >
              <span className="uppercase">{option}</span>
              {submitted && idx === correctIndex && <CheckCircle2 className="w-5 h-5 flex-shrink-0 ml-2" />}
              {submitted && idx === selectedIndex && idx !== correctIndex && <XCircle className="w-5 h-5 flex-shrink-0 ml-2" />}
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
          className="w-full py-3 bg-base-900 text-base-50 border-2 border-base-900 hover:bg-base-800"
        >
          CONFIRMAR
        </PrimaryButton3D>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 border-2 font-mono uppercase text-[10px] font-bold ${isCorrect ? 'bg-success text-base-900 border-base-900' : 'bg-error text-base-50 border-base-900'} shadow-pixel-sm`}
        >
          <p className="font-pixel mb-2 flex items-center gap-2 tracking-tighter">
            {isCorrect ? 'STATUS: OK' : 'STATUS: FAIL'}
          </p>
          <p className="leading-relaxed normal-case">{explanation}</p>
        </div>
      )}
    </div>
  );
};
