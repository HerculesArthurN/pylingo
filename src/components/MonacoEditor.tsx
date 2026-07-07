import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  height = "100%",
  readOnly = false
}) => {
  const handleEditorChange = (val: string | undefined) => {
    if (val !== undefined) {
      onChange(val);
    }
  };

  return (
    <div className="w-full h-full relative" style={{ height }}>
      <Editor
        language="python"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        loading={
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-xs font-mono text-slate-400 gap-3">
            {/* Esqueleto animado de loading */}
            <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-emerald-500 animate-spin"></div>
            <span>Carregando Monaco Editor...</span>
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Courier New', Courier, monospace",
          fontLigatures: true,
          lineHeight: 22,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
          wordWrap: 'on',
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          padding: {
            top: 12,
            bottom: 12
          }
        }}
      />
    </div>
  );
};

export default MonacoEditor;
