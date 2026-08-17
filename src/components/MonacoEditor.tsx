import React from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

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

  const handleBeforeMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('bioma-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'A7F3D0', fontStyle: 'bold' },
        { token: 'string', foreground: 'FBBF24' },
        { token: 'number', foreground: 'F59E0B' },
        { token: 'comment', foreground: '94A3B8', fontStyle: 'italic' },
        { token: 'function', foreground: '34AA70', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'F5F9F6' },
        { token: 'operator', foreground: '34AA70' },
      ],
      colors: {
        'editor.background': '#121214',
        'editor.foreground': '#F4F4F8',
        'editor.lineHighlightBackground': '#1A1A22',
        'editorCursor.foreground': '#4ADE80',
        'editorWhitespace.foreground': '#2A2A35',
        'editorIndentGuide.background': '#2A2A35',
        'editorIndentGuide.activeBackground': '#4ADE80',
        'editorLineNumber.foreground': '#5C5C70',
        'editorLineNumber.activeForeground': '#4ADE80',
        'editor.selectionBackground': '#4ADE8033',
        'editor.inactiveSelectionBackground': '#4ADE8018',
      },
    });
  };

  return (
    <div className="w-full h-full relative [isolation:isolate] z-10" style={{ height }}>
      <Editor
        language="python"
        theme="bioma-dark"
        beforeMount={handleBeforeMount}
        value={value}
        onChange={handleEditorChange}
        loading={
          <div className="absolute inset-0 bg-base-950 flex flex-col items-center justify-center text-xs font-mono text-base-400 gap-3">
            {/* Esqueleto animado de loading */}
            <div className="w-8 h-8 rounded-full border-4 border-base-800 border-t-emerald-500 animate-spin"></div>
            <span>Carregando Monaco Editor...</span>
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace",
          fontLigatures: true,
          lineHeight: 22,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          insertSpaces: true,
          detectIndentation: false,
          wordWrap: 'on',
          fixedOverflowWidgets: true,
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
