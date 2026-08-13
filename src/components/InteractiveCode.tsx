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
        setOutput(res.output || 'Código executado sem saídas de texto.');
      }
    } catch (err) {
      setError('Erro ao executar código no ambiente Python.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 my-4 shadow-md font-mono text-xs select-none">
      {/* Bar */}
      <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-emerald-400" /> Playground Interativo
        </span>
        {runnable && onRunCode && (
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all text-[11px] disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Executando...' : 'Testar Código'}</span>
          </button>
        )}
      </div>

      {/* Editor / Code view */}
      <div className="p-4 bg-slate-900">
        {editable ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={Math.max(3, code.split('\n').length)}
            className="w-full bg-transparent text-emerald-400 font-mono focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        ) : (
          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{code}</pre>
        )}
      </div>

      {/* Output / Console result */}
      {(output !== null || error !== null) && (
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Saída do Interpretador:
          </span>
          {output && <pre className="text-slate-200 whitespace-pre-wrap select-text">{output}</pre>}
          {error && <pre className="text-rose-400 whitespace-pre-wrap select-text">{error}</pre>}
        </div>
      )}
    </div>
  );
};
