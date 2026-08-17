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

// Helper function to render text with inline math $...$ as clean code pills
function renderFormattedText(text: string) {
  if (!text.includes('$')) {
    return text;
  }

  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 font-mono text-[11px] sm:text-xs font-semibold rounded bg-accent/15 text-accent border border-accent/30"
        >
          {math}
        </code>
      );
    }
    return part;
  });
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
          <p key={index} className="text-base-800 dark:text-base-200 text-xs sm:text-sm md:text-base leading-relaxed my-3 whitespace-pre-line font-sans font-normal">
            {renderFormattedText(block.content)}
          </p>
        );

      case 'analogy':
        return (
          <div key={index} className="bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/30 dark:border-amber-500/40 rounded-xl p-4 sm:p-5 md:p-6 my-4 shadow-xs">
            <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-200 font-bold text-sm sm:text-base mb-2 font-sans">
              <span className="text-xl md:text-2xl">{block.emoji}</span>
              <h4>{block.title}</h4>
            </div>
            <p className="text-amber-950 dark:text-amber-100 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans font-medium">
              {renderFormattedText(block.content)}
            </p>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="my-4">
            {block.caption && (
              <span className="text-[11px] font-bold text-base-500 dark:text-base-400 uppercase tracking-wider block mb-1 font-mono">
                {block.caption}
              </span>
            )}
            <pre className="bg-base-950 text-emerald-300 p-4 rounded-xl overflow-x-auto font-mono text-xs sm:text-sm border-2 border-base-800 shadow-sm leading-relaxed">
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
            bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200',
            icon: <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          },
          tip: {
            bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200',
            icon: <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
          },
          warning: {
            bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200',
            icon: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
          },
          note: {
            bg: 'bg-base-100 dark:bg-base-800 border-base-300 dark:border-base-700 text-base-800 dark:text-base-200',
            icon: <Info className="w-5 h-5 text-base-500 dark:text-base-400 shrink-0" />,
          },
        };

        const config = variants[block.variant] || variants.note;

        return (
          <div key={index} className={`border-2 rounded-xl p-4 my-4 flex items-start space-x-3 text-xs sm:text-sm leading-relaxed font-sans font-medium ${config.bg}`}>
            {config.icon}
            <div className="whitespace-pre-line flex-1">{renderFormattedText(block.content)}</div>
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
    <div className="space-y-3 select-text">
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-base-900 dark:text-base-50 border-b border-base-200 dark:border-base-800 pb-3 mb-4 flex items-center gap-2 font-sans">
        <BookOpen className="w-5 h-5 text-accent" />
        <span>{section.title}</span>
      </h3>

      {section.content.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
};
