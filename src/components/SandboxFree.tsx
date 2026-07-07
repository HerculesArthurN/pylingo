import React, { Suspense, lazy } from 'react';
import { Play, Terminal, Code2 } from 'lucide-react';

// Carregamento Preguiçoso do Monaco Editor
const MonacoEditorLazy = lazy(() => import('./MonacoEditor'));

interface SandboxFreeProps {
  code: string;
  onChangeCode: (code: string) => void;
  output: string;
  onExecute: () => void;
  isLoading: boolean;
  pyodideReady: boolean;
}

export const SandboxFree: React.FC<SandboxFreeProps> = ({
  code,
  onChangeCode,
  output,
  onExecute,
  isLoading,
  pyodideReady
}) => {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-6 select-none">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Modo Sandbox Livre</h2>
          <p className="text-xs text-slate-500 mt-1">
            Explore o Python livremente! Digite código no painel e clique em Executar para testá-lo.
          </p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide border border-emerald-200">
          Python 3.11 WASM
        </div>
      </div>

      {/* Editor e Console */}
      <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col">
        
        {/* Barra superior do editor */}
        <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span>sandbox.py</span>
          </div>
          <button
            onClick={() => onChangeCode('# Escreva qualquer código aqui!\n\nfor i in range(5):\n    print(f"Olá, PyLingo número {i}!")\n')}
            className="text-xs text-emerald-400 font-mono hover:underline focus:outline-none"
          >
            Carregar Exemplo
          </button>
        </div>

        {/* Editor Real com Lazy Loading */}
        <div className="h-64 min-h-[200px] w-full bg-slate-950">
          <Suspense
            fallback={
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-xs font-mono text-slate-400 gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin"></div>
                <span>Carregando Editor Sandbox...</span>
              </div>
            }
          >
            <MonacoEditorLazy
              value={code}
              onChange={onChangeCode}
              readOnly={isLoading}
            />
          </Suspense>
        </div>

        {/* Console / Terminal simulado */}
        <div className="bg-slate-900 border-t border-slate-800 flex flex-col">
          <div className="px-4 py-2 bg-slate-950 flex items-center text-xs font-mono text-slate-400 border-b border-slate-850">
            <Terminal className="w-4 h-4 text-blue-500 mr-2" />
            <span>Terminal de Saída</span>
          </div>
          <div className="p-4 font-mono text-xs overflow-y-auto min-h-[95px] max-h-[200px] text-slate-300">
            {output ? (
              <pre className="text-emerald-400 whitespace-pre-wrap select-text">{output}</pre>
            ) : (
              <span className="text-slate-500 italic select-none">Nenhuma saída gerada. Clique em "Executar" para rodar o código.</span>
            )}
          </div>
        </div>

      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end select-none">
        <button
          onClick={onExecute}
          disabled={isLoading || !pyodideReady}
          className={`btn-duo-primary ${isLoading || !pyodideReady ? 'btn-duo-disabled opacity-50' : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700'} flex items-center gap-2`}
        >
          <Play className="w-4 h-4 text-white fill-current" />
          <span>Executar Código</span>
        </button>
      </div>

    </div>
  );
};

export default SandboxFree;
