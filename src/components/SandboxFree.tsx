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
    <div className="bg-bioma-card rounded-organic-md border border-bioma-border p-6 shadow-warm-sm space-y-6 select-none">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-bioma-moss">Modo Sandbox Livre</h2>
          <p className="text-xs text-bioma-muted mt-1 font-medium">
            Explore o Python livremente! Digite código no painel e clique em Executar para testá-lo.
          </p>
        </div>
        <div className="bg-bioma-leaf-light text-bioma-leaf text-xs font-extrabold px-3 py-1 rounded-organic-sm uppercase tracking-wide border border-bioma-leaf/30">
          Python 3.11 WASM
        </div>
      </div>

      {/* Editor e Console */}
      <div className="bg-[#121E17] rounded-organic-md overflow-hidden border border-bioma-moss flex flex-col shadow-warm-sm">
        
        {/* Barra superior do editor */}
        <div className="bg-[#0A140E] px-4 py-3 flex items-center justify-between border-b border-bioma-moss/50">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Code2 className="w-4 h-4 text-bioma-leaf" />
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
        <div className="h-64 min-h-[200px] w-full bg-[#121E17]">
          <Suspense
            fallback={
              <div className="w-full h-full bg-[#121E17] flex flex-col items-center justify-center text-xs font-mono text-bioma-muted gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-bioma-moss border-t-bioma-leaf animate-spin"></div>
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
        <div className="bg-[#121E17] border-t border-bioma-moss/50 flex flex-col" role="region" aria-live="polite" aria-label="Terminal de saída do Sandbox">
          <div className="px-4 py-2 bg-[#0A140E] flex items-center text-xs font-mono text-emerald-400 border-b border-bioma-moss/50">
            <Terminal className="w-4 h-4 text-bioma-leaf mr-2" aria-hidden="true" />
            <span className="font-bold">Terminal de Saída</span>
          </div>
          <div className="p-4 font-mono text-xs overflow-y-auto min-h-[95px] max-h-[200px] text-stone-200">
            {output ? (
              <pre className="text-emerald-300 font-bold whitespace-pre-wrap select-text">{output}</pre>
            ) : (
              <span className="text-emerald-200/70 font-semibold italic select-none">Nenhuma saída gerada. Clique em "Executar Código" para rodar.</span>
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
