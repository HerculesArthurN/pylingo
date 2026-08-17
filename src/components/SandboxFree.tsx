import React, { Suspense, lazy } from 'react';
import { Play, Terminal, Code2 } from 'lucide-react';
import { PrimaryButton3D } from './PrimaryButton3D';

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
    <div className="bg-base-100 dark:bg-base-900 rounded-xl border-2 border-base-900 dark:border-base-700 p-4 sm:p-6 shadow-brutal space-y-4 sm:space-y-6 select-none font-sans">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-base-900 dark:text-base-50">Modo Sandbox Livre</h2>
          <p className="text-xs sm:text-sm text-base-600 dark:text-base-400 mt-0.5 font-normal">
            Explore o Python livremente! Digite código no painel e clique em Executar para testá-lo.
          </p>
        </div>
        <div className="bg-accent/15 text-accent text-xs font-bold font-mono px-2.5 py-1 rounded-lg uppercase tracking-wide border border-accent/30 shrink-0">
          Python 3.11 WASM
        </div>
      </div>

      {/* Editor e Console */}
      <div className="bg-base-950 rounded-xl overflow-hidden border-2 border-base-900 dark:border-base-700 flex flex-col shadow-sm">
        
        {/* Barra superior do editor */}
        <div className="bg-base-900 px-4 py-2.5 flex items-center justify-between border-b-2 border-base-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
            <Code2 className="w-4 h-4 text-accent" />
            <span>sandbox.py</span>
          </div>
          <button
            onClick={() => onChangeCode('# Escreva qualquer código aqui!\n\nfor i in range(5):\n    print(f"Olá, PyLingo número {i}!")\n')}
            className="text-xs text-emerald-400 font-mono hover:underline focus:outline-none cursor-pointer"
          >
            Carregar Exemplo
          </button>
        </div>

        {/* Editor Real com Lazy Loading */}
        <div className="h-64 min-h-[200px] w-full bg-base-950">
          <Suspense
            fallback={
              <div className="w-full h-full bg-base-950 flex flex-col items-center justify-center text-xs font-mono text-base-400 gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-base-700 border-t-accent animate-spin"></div>
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
        <div className="bg-base-950 border-t-2 border-base-800 flex flex-col" role="region" aria-live="polite" aria-label="Terminal de saída do Sandbox">
          <div className="px-4 py-2 bg-base-900 flex items-center text-xs font-mono text-emerald-400 border-b border-base-800">
            <Terminal className="w-4 h-4 text-accent mr-2" aria-hidden="true" />
            <span className="font-bold">Terminal de Saída</span>
          </div>
          <div className="p-4 font-mono text-xs overflow-y-auto min-h-[95px] max-h-[200px] text-base-100">
            {output ? (
              <pre className="text-emerald-300 font-bold whitespace-pre-wrap select-text">{output}</pre>
            ) : (
              <span className="text-base-500 font-medium italic select-none">Nenhuma saída gerada. Clique em "Executar Código" para rodar.</span>
            )}
          </div>
        </div>

      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end select-none">
        <PrimaryButton3D
          variant="leaf"
          onClick={onExecute}
          disabled={isLoading || !pyodideReady}
        >
          <Play className="w-4 h-4 text-white fill-current" />
          <span>Executar Código</span>
        </PrimaryButton3D>
      </div>

    </div>
  );
};

export default SandboxFree;
