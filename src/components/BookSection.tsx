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
          <p key={index} className="text-bioma-bark text-xs sm:text-sm md:text-base leading-relaxed my-3 whitespace-pre-line font-medium">
            {block.content}
          </p>
        );

      case 'analogy':
        return (
          <div key={index} className="bg-bioma-sand border border-bioma-leaf/30 rounded-organic-md p-5 md:p-6 my-5 shadow-warm-sm">
            <div className="flex items-center space-x-2 text-bioma-moss font-bold text-sm md:text-base mb-2">
              <span className="text-xl md:text-2xl">{block.emoji}</span>
              <h4>{block.title}</h4>
            </div>
            <p className="text-bioma-muted text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium">
              {block.content}
            </p>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="my-4">
            {block.caption && (
              <span className="text-xs font-extrabold text-bioma-muted uppercase tracking-wider block mb-1.5">
                {block.caption}
              </span>
            )}
            <pre className="bg-bioma-moss-dark text-[#A7F3D0] p-4 rounded-organic-sm overflow-x-auto font-mono text-xs md:text-sm border border-bioma-moss shadow-warm-sm leading-relaxed">
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
            bg: 'bg-bioma-leaf-light border-bioma-leaf/40 text-bioma-moss font-bold',
            icon: <Sparkles className="w-5 h-5 text-bioma-leaf flex-shrink-0" />,
          },
          tip: {
            bg: 'bg-bioma-amber-soft border-bioma-amber/40 text-bioma-amber font-bold',
            icon: <Lightbulb className="w-5 h-5 text-bioma-amber flex-shrink-0" />,
          },
          warning: {
            bg: 'bg-bioma-clay-soft border-bioma-clay/40 text-bioma-clay font-bold',
            icon: <AlertTriangle className="w-5 h-5 text-bioma-clay flex-shrink-0" />,
          },
          note: {
            bg: 'bg-bioma-sand border-bioma-border text-bioma-bark font-medium',
            icon: <Info className="w-5 h-5 text-bioma-muted flex-shrink-0" />,
          },
        };

        const config = variants[block.variant] || variants.note;

        return (
          <div key={index} className={`border rounded-organic-sm p-4 my-4 flex items-start space-x-3 text-xs md:text-sm leading-relaxed ${config.bg}`}>
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
      <h3 className="text-lg md:text-xl font-bold text-bioma-moss border-b border-bioma-border pb-3 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-bioma-leaf" />
        <span>{section.title}</span>
      </h3>

      {section.content.map((block, idx) => renderBlock(block, idx))}
    </div>
  );
};
