import React from 'react';
import { IBookSection, IContentBlock } from '../core/types';
import { InteractiveCode } from './InteractiveCode';
import { MiniQuiz } from './MiniQuiz';
import { RunResult } from '../hooks/usePyodide';
import { BookOpen, Sparkles, Lightbulb, AlertTriangle, Info } from 'lucide-react';

interface BookSectionProps {
  section: IBookSection;
  onRunCode?: (code: string) => Promise<RunResult>;
  playSound?: (type: 'success' | 'error' | 'click') => void;
}

export const BookSection: React.FC<BookSectionProps> = ({
  section,
  onRunCode,
  playSound,
}) => {
  const renderBlock = (block: IContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <p key={index} className="text-slate-700 text-xs sm:text-sm md:text-base leading-relaxed my-3 whitespace-pre-line font-medium">
            {block.content}
          </p>
        );

      case 'analogy':
        return (
          <div key={index} className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-5 md:p-6 my-5 shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-800 font-black text-sm md:text-base mb-2">
              <span className="text-xl md:text-2xl">{block.emoji}</span>
              <h4>{block.title}</h4>
            </div>
            <p className="text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
              {block.content}
            </p>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="my-4">
            {block.caption && (
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                {block.caption}
              </span>
            )}
            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl overflow-x-auto font-mono text-xs md:text-sm border-2 border-slate-800 shadow-sm leading-relaxed">
              <code>{block.code}</code>
            </pre>
          </div>
        );

      case 'interactive_code':
        return (
          <InteractiveCode
            key={index}
            initialCode={block.code}
            editable={block.editable}
            runnable={block.runnable}
            onRunCode={onRunCode}
          />
        );

      case 'callout': {
        const variants = {
          pythonic: {
            bg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
            icon: <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
          },
          tip: {
            bg: 'bg-blue-50 border-blue-300 text-blue-950',
            icon: <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />,
          },
          warning: {
            bg: 'bg-amber-50 border-amber-300 text-amber-950',
            icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          },
          note: {
            bg: 'bg-slate-100 border-slate-300 text-slate-900',
            icon: <Info className="w-5 h-5 text-slate-600 flex-shrink-0" />,
          },
        };

        const config = variants[block.variant] || variants.note;

        return (
          <div key={index} className={`border-2 rounded-2xl p-4 my-4 flex items-start space-x-3 text-xs md:text-sm font-semibold leading-relaxed ${config.bg}`}>
            {config.icon}
            <div className="whitespace-pre-line">{block.content}</div>
          </div>
        );
      }

      case 'quiz':
        return (
          <MiniQuiz
            key={index}
            question={block.question}
            options={block.options}
            correctIndex={block.correctIndex}
            explanation={block.explanation}
            playSound={playSound}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2 select-text">
      <h3 className="text-lg md:text-xl font-black text-slate-800 border-b-2 border-slate-100 pb-3 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-emerald-500" />
        <span>{section.title}</span>
      </h3>

      {section.content.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
};
