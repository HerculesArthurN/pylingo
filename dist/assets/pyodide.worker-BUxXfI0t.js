(function(){"use strict";let t=null;async function f(){if(t)return t;try{const{loadPyodide:e}=await import("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.mjs");t=await e({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"})}catch(e){throw new Error(`[PyLingo] Falha ao carregar Pyodide da CDN. Verifique sua conexão com a internet ou se a CDN não está bloqueada. Detalhes: ${e.message}`)}return await t.runPythonAsync(`
import sys
import io
`),t}function _(e){const a=[],y=e.split(`
`);for(const c of y){const r=c.trim();(r.startsWith("assert ")||r.startsWith("assert("))&&a.push(r)}return a}self.onmessage=async e=>{const{type:a,code:y,testAssertions:c,executionId:r}=e.data;if(a==="init"){try{await f(),self.postMessage({type:"init-ready",success:!0})}catch(s){self.postMessage({type:"init-ready",success:!1,error:s.message})}return}if(a==="run")try{const s=await f();await s.runPythonAsync(`
import sys
_m = sys.modules['__main__'].__dict__
_user_keys = [k for k in list(_m.keys()) if not k.startswith('__') and k not in ('sys', 'io', '_m', '_k', '_user_keys')]
for _k in _user_keys:
    _m.pop(_k, None)
_m.pop('_user_keys', None)
_m.pop('_m', None)
`),await s.runPythonAsync(`
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`),await s.runPythonAsync(y);let n,i,u,o;if(c){const p=_(c);n=p.length,i=0,u=0;for(const d of p)try{await s.runPythonAsync(d),i++}catch(l){u++,o||(o=l.message);break}if(u>0&&o){const d=await s.runPythonAsync("sys.stdout.getvalue()"),l=await s.runPythonAsync("sys.stderr.getvalue()");self.postMessage({type:"run-result",executionId:r,success:!1,output:d,error:o,stderr:l||void 0,testsTotal:n,testsPassed:i,testsFailed:u,firstFailedMessage:o});return}}const h=await s.runPythonAsync("sys.stdout.getvalue()"),g=await s.runPythonAsync("sys.stderr.getvalue()");self.postMessage({type:"run-result",executionId:r,success:!0,output:h,error:g||void 0,testsTotal:n,testsPassed:i,testsFailed:u,firstFailedMessage:o})}catch(s){let n="";try{t&&(n=await t.runPythonAsync("sys.stdout.getvalue()"))}catch{}self.postMessage({type:"run-result",executionId:r,success:!1,output:n,error:s.message,testsTotal:void 0,testsPassed:void 0,testsFailed:void 0,firstFailedMessage:void 0})}}})();
