import React, { useState } from 'react';
import { Play, Terminal, CheckCircle2 } from 'lucide-react';
import { RunResult } from '../hooks/usePyodide';

interface InteractiveCodeProps {
  initialCode: string;
  editable: boolean;
  runnable: boolean;
  onRunCode?: (code: string) => Promise<RunResult>;
}

export const InteractiveCode: React.FC<InteractiveCodeProps> = ({
  initialCode,
  editable,
  runnable,
  onRunCode,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!onRunCode || isRunning) return;
    setIsRunning(true);
    setOutput(null);
    setError(null);

    try {
      const res = await onRunCode(code);
      if (res.error) {
        setError(res.error);
      } else {
        setOutput(res.output || 'No text output.');
      }
    } catch (err) {
      setError('System Error: Pyodide execution failed.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-base-900 overflow-hidden border-2 border-base-900 my-4 shadow-brutal font-mono select-none flex flex-col">
      {/* Bar */}
      <div className="bg-base-900 px-4 py-2 border-b-2 border-base-50 flex items-center justify-between">
        <span className="text-accent font-pixel text-[10px] uppercase flex items-center gap-2">
          <Terminal className="w-4 h-4" /> PLAYGROUND
        </span>
        {runnable && onRunCode && (
          <button
            onClick={handleRun}
            disabled={isRunning}
            aria-label={isRunning ? 'Executando código Python' : 'Testar código Python'}
            className="px-4 py-1.5 bg-accent hover:bg-base-50 text-base-900 font-bold font-pixel text-[10px] uppercase transition-colors focus-visible:outline focus-visible:outline-2 disabled:opacity-50 cursor-pointer shadow-pixel-sm flex items-center gap-2"
          >
            <Play className="w-3 h-3 fill-current" aria-hidden="true" />
            <span>{isRunning ? 'RUNNING' : 'RUN'}</span>
          </button>
        )}
      </div>

      {/* Editor / Code view */}
      <div className="p-4 bg-base-900 text-base-50">
        {editable ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={Math.max(3, code.split('\n').length)}
            aria-label="Editor de código Python interativo"
            className="w-full bg-transparent text-base-50 font-mono text-[10px] md:text-xs focus-visible:outline focus-visible:outline-2 rounded-none resize-none leading-relaxed"
            spellCheck={false}
          />
        ) : (
          <pre className="text-base-50 whitespace-pre-wrap leading-relaxed text-[10px] md:text-xs">{code}</pre>
        )}
      </div>

      {/* Output / Console result */}
      {(output !== null || error !== null) && (
        <div 
          role="region"
          aria-live="polite"
          aria-label="Saída de execução do código"
          className="bg-base-900 p-4 border-t-2 border-base-50 flex flex-col gap-2"
        >
          <span className="text-[10px] font-pixel text-accent uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> TERMINAL OUT:
          </span>
          {output && <pre className="text-base-50 font-mono text-[10px] md:text-xs whitespace-pre-wrap select-text">{output}</pre>}
          {error && <pre className="text-error font-mono text-[10px] md:text-xs whitespace-pre-wrap select-text">{error}</pre>}
        </div>
      )}
    </div>
  );
};
