import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

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
    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 md:p-6 my-4 select-none">
      <div className="flex items-center space-x-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-3">
        <HelpCircle className="w-4 h-4" />
        <span>Mini Quiz de Fixação</span>
      </div>

      <h4 className="text-sm md:text-base font-bold text-slate-800 mb-4">{question}</h4>

      <div className="space-y-2.5 mb-4">
        {options.map((option, idx) => {
          let btnStyle = 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700';

          if (submitted) {
            if (idx === correctIndex) {
              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
            } else if (idx === selectedIndex) {
              btnStyle = 'border-rose-500 bg-rose-50 text-rose-800 font-bold';
            } else {
              btnStyle = 'border-slate-200 bg-slate-100 text-slate-400 opacity-60';
            }
          } else if (idx === selectedIndex) {
            btnStyle = 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold shadow-sm';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted}
              className={`w-full text-left p-3.5 rounded-2xl border-2 text-xs md:text-sm transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {submitted && idx === correctIndex && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />}
              {submitted && idx === selectedIndex && idx !== correctIndex && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
            selectedIndex === null
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1'
          }`}
        >
          Confirmar Resposta
        </button>
      ) : (
        <div className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'} text-xs leading-relaxed`}>
          <p className="font-bold mb-1 flex items-center gap-1.5">
            {isCorrect ? '✨ Excelente! Você acertou!' : '❌ Não é bem isso...'}
          </p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};
