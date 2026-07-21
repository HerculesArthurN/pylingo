(function(){"use strict";let s=null;async function _(){if(s)return s;try{importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js")}catch(n){throw new Error(`[PyLingo] Falha ao carregar Pyodide da CDN. Verifique sua conexão com a internet ou se a CDN não está bloqueada. Detalhes: ${n.message}`)}return s=await self.loadPyodide(),await s.runPythonAsync(`
import sys
import io
`),s}function f(n){const i=[],y=n.split(`
`);for(const u of y){const e=u.trim();(e.startsWith("assert ")||e.startsWith("assert("))&&i.push(e)}return i}self.onmessage=async n=>{const{type:i,code:y,testAssertions:u,executionId:e}=n.data;if(i==="init"){try{await _(),self.postMessage({type:"init-ready",success:!0})}catch(t){self.postMessage({type:"init-ready",success:!1,error:t.message})}return}if(i==="run")try{const t=await _();await t.runPythonAsync(`
import types as _types
_main = sys.modules['__main__']
_preserve = {k for k in _main.__dict__ if k.startswith('__') or isinstance(_main.__dict__[k], _types.ModuleType)}
for _k in list(_main.__dict__.keys()):
    if _k not in _preserve:
        del _main.__dict__[_k]
del _preserve, _k, _main, _types
`),await t.runPythonAsync(`
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`),await t.runPythonAsync(y);let r,o,c,a;if(u){const p=f(u);r=p.length,o=0,c=0;for(const d of p)try{await t.runPythonAsync(d),o++}catch(l){c++,a||(a=l.message);break}if(c>0&&a){const d=await t.runPythonAsync("sys.stdout.getvalue()"),l=await t.runPythonAsync("sys.stderr.getvalue()");self.postMessage({type:"run-result",executionId:e,success:!1,output:d,error:a,stderr:l||void 0,testsTotal:r,testsPassed:o,testsFailed:c,firstFailedMessage:a});return}}const h=await t.runPythonAsync("sys.stdout.getvalue()"),g=await t.runPythonAsync("sys.stderr.getvalue()");self.postMessage({type:"run-result",executionId:e,success:!0,output:h,error:g||void 0,testsTotal:r,testsPassed:o,testsFailed:c,firstFailedMessage:a})}catch(t){let r="";try{s&&(r=await s.runPythonAsync("sys.stdout.getvalue()"))}catch{}self.postMessage({type:"run-result",executionId:e,success:!1,output:r,error:t.message,testsTotal:void 0,testsPassed:void 0,testsFailed:void 0,firstFailedMessage:void 0})}}})();
