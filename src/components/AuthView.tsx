/**
 * AuthView.tsx
 *
 * Componente de login e registro premium com suporte a modo offline resiliente.
 *
 * Contrato (DbC):
 *   - Pré-condição: `onAuthSuccess`, `onClose` e `playSound` devem ser fornecidos.
 *   - Pós-condição: Invoca `onAuthSuccess` com o objeto do usuário autenticado no sucesso;
 *                   Toca os efeitos sonoros correspondentes baseados nos resultados das ações.
 *   - Invariante: O e-mail informado deve possuir formato válido antes de submeter a requisição (Fail-Fast).
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, X, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Mascot } from './Mascot';
import { MascotMood } from '../core/types';
import { supabase, isCloudEnabled } from '../core/supabaseClient';

interface AuthViewProps {
  onAuthSuccess: (user: any) => void;
  onClose: () => void;
  playSound: (type: 'success' | 'error' | 'click') => void;
}

type AuthMode = 'login' | 'register';

type AuthStatus =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; email: string }
  | { type: 'error'; message: string };

export const AuthView: React.FC<AuthViewProps> = ({
  onAuthSuccess,
  onClose,
  playSound,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<AuthStatus>({ type: 'idle' });
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');

  // Ajusta humor do mascote com base no estado do formulário
  useEffect(() => {
    if (status.type === 'loading') {
      setMascotMood('thinking');
    } else if (status.type === 'error') {
      setMascotMood('sad');
    } else if (status.type === 'success') {
      setMascotMood('happy');
    } else {
      setMascotMood(email.length > 0 ? 'geek' : 'thinking');
    }
  }, [status.type, email]);

  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');

    // Validação Fail-Fast local
    if (!validateEmail(email)) {
      setStatus({ type: 'error', message: 'Por favor, insira um e-mail com formato válido.' });
      playSound('error');
      return;
    }

    if (password.length < 6) {
      setStatus({ type: 'error', message: 'A senha deve conter no mínimo 6 caracteres.' });
      playSound('error');
      return;
    }

    setStatus({ type: 'loading' });

    try {
      if (isCloudEnabled && supabase) {
        if (mode === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error('Nenhum usuário retornado do servidor.');

          setStatus({ type: 'success', email: data.user.email ?? email });
          playSound('success');
          
          setTimeout(() => {
            onAuthSuccess(data.user);
          }, 1200);

        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error('Falha no cadastro do usuário.');

          setStatus({ type: 'success', email: data.user.email ?? email });
          playSound('success');
          
          // Se precisar de confirmação de e-mail no Supabase, avisa o usuário
          // const isEmailConfirmed = data.user.identities && data.user.identities.length > 0;
          setTimeout(() => {
            onAuthSuccess(data.user);
          }, 1500);
        }
      } else {
        // Simulando fluxo offline para testes locais
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockUser = {
          id: 'offline-user-12345',
          email: email,
          created_at: new Date().toISOString(),
        };

        setStatus({ type: 'success', email: mockUser.email });
        playSound('success');

        setTimeout(() => {
          onAuthSuccess(mockUser);
        }, 1200);
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setStatus({
        type: 'error',
        message: err.message || 'Ocorreu um erro inesperado na conexão.',
      });
      playSound('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md overflow-hidden bg-white border-2 border-slate-200 border-b-8 rounded-3xl shadow-2xl p-6"
      >
        {/* Botão de Fechar */}
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho com Mascote */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="h-24 w-24 flex items-center justify-center bg-emerald-50 rounded-3xl border-2 border-emerald-100 shadow-inner p-2 mb-3">
            <Mascot mood={mascotMood} size="h-20 w-20" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-1 text-center px-4">
            {mode === 'login'
              ? 'Conecte-se para sincronizar seus badges, XP e conquistas.'
              : 'Registre-se para salvar seu progresso no Python em nuvem.'}
          </p>
        </div>

        {/* Feedback visual de estado de sucesso/erro */}
        <AnimatePresence mode="wait">
          {status.type === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2.5 p-3.5 mb-4 text-sm text-rose-700 bg-rose-50 border-2 border-rose-100 rounded-2xl"
            >
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <div className="font-semibold leading-snug">{status.message}</div>
            </motion.div>
          )}

          {status.type === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2.5 p-3.5 mb-4 text-sm text-emerald-700 bg-emerald-50 border-2 border-emerald-100 rounded-2xl animate-pulse"
            >
              <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
              <div className="font-semibold leading-snug">
                {mode === 'login' ? 'Sucesso! Entrando...' : 'Conta criada com sucesso!'}
                <p className="text-xs font-medium text-emerald-600 mt-0.5">{status.email}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                disabled={status.type === 'loading' || status.type === 'success'}
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={status.type === 'loading' || status.type === 'success'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowPassword(!showPassword);
                }}
                disabled={status.type === 'loading' || status.type === 'success'}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-60"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={status.type === 'loading' || status.type === 'success'}
            className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 border-b-4 border-emerald-700 active:border-b-0 text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:translate-y-0 disabled:border-b-4"
          >
            {status.type === 'loading' ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Processando...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Entrar' : 'Registrar-se'}</span>
            )}
          </button>
        </form>

        {/* Divisor */}
        <div className="relative flex items-center my-5">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Ou
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Alternância e Continuar Offline */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={status.type === 'loading' || status.type === 'success'}
            onClick={() => {
              playSound('click');
              setMode(mode === 'login' ? 'register' : 'login');
              setStatus({ type: 'idle' });
            }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-extrabold text-sm rounded-2xl transition-colors disabled:opacity-60"
          >
            {mode === 'login'
              ? 'Não tem uma conta? Cadastre-se'
              : 'Já tem uma conta? Faça Login'}
          </button>

          <button
            type="button"
            disabled={status.type === 'loading' || status.type === 'success'}
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-slate-600 hover:underline transition-all"
          >
            Continuar em Modo Offline
          </button>
        </div>

        {/* Indica modo atual offline se nuvem desativada */}
        {!isCloudEnabled && (
          <div className="mt-4 text-center text-[10px] font-bold text-amber-500 bg-amber-50 rounded-xl p-2 border border-amber-100">
            Conexão com a Nuvem desativada (Modo Sandbox Offline ativo).
          </div>
        )}
      </motion.div>
    </div>
  );
};
