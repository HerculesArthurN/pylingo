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
        'editor.background': '#07140D',
        'editor.foreground': '#F5F9F6',
        'editor.lineHighlightBackground': '#14221A',
        'editorCursor.foreground': '#34AA70',
        'editorWhitespace.foreground': '#293830',
        'editorIndentGuide.background': '#293830',
        'editorIndentGuide.activeBackground': '#34AA70',
        'editorLineNumber.foreground': '#64748B',
        'editorLineNumber.activeForeground': '#34AA70',
        'editor.selectionBackground': '#34AA7044',
        'editor.inactiveSelectionBackground': '#34AA7022',
      },
    });
  };

  return (
    <div className="w-full h-full relative" style={{ height }}>
      <Editor
        language="python"
        theme="bioma-dark"
        beforeMount={handleBeforeMount}
        value={value}
        onChange={handleEditorChange}
        loading={
          <div className="absolute inset-0 bg-bioma-moss-dark flex flex-col items-center justify-center text-xs font-mono text-bioma-muted gap-3">
            {/* Esqueleto animado de loading */}
            <div className="w-8 h-8 rounded-full border-4 border-bioma-moss border-t-bioma-leaf animate-spin"></div>
            <span>Carregando Monaco Editor (Bioma)...</span>
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
