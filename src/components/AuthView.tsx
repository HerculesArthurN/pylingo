/**
 * AuthView.tsx
 *
 * Componente de login e registro premium com suporte a modo offline resiliente (Bioma Pythonico).
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, X, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Mascot } from './Mascot';
import { MascotMood } from '../core/types';
import { supabase, isCloudEnabled } from '../core/supabaseClient';
import { biomaFadeInScale } from '../utils/motion';
import { PrimaryButton3D } from './PrimaryButton3D';

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
          
          setTimeout(() => {
            onAuthSuccess(data.user);
          }, 1500);
        }
      } else {
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
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Autenticação do Usuário"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bioma-moss-dark/70 backdrop-blur-sm"
    >
      <motion.div
        {...biomaFadeInScale}
        className="relative w-full max-w-md overflow-hidden bg-bioma-card border border-bioma-border rounded-organic-md shadow-warm-md p-6"
      >
        {/* Botão de Fechar */}
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-organic-sm text-bioma-muted hover:text-bioma-bark hover:bg-bioma-sand transition-colors cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
          aria-label="Fechar"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Cabeçalho com Mascote */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="h-24 w-24 flex items-center justify-center bg-bioma-sand rounded-organic-sm border border-bioma-border shadow-inner p-2 mb-3">
            <Mascot mood={mascotMood} size="h-20 w-20" />
          </div>
          <h2 className="text-2xl font-extrabold text-bioma-moss tracking-tight">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p className="text-xs font-semibold text-bioma-muted mt-1 text-center px-4">
            {mode === 'login'
              ? 'Conecte-se para sincronizar seus badges, XP e conquistas.'
              : 'Registre-se para salvar seu progresso no Python em nuvem.'}
          </p>
        </div>

        {/* Feedback visual */}
        <AnimatePresence mode="wait">
          {status.type === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2.5 p-3.5 mb-4 text-sm text-bioma-clay bg-bioma-clay-soft border border-bioma-clay/30 rounded-organic-sm"
            >
              <AlertCircle className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
              <div className="font-semibold leading-snug">{status.message}</div>
            </motion.div>
          )}

          {status.type === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-2.5 p-3.5 mb-4 text-sm text-bioma-leaf bg-bioma-leaf-light border border-bioma-leaf/30 rounded-organic-sm animate-pulse"
            >
              <CheckCircle2 className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
              <div className="font-semibold leading-snug">
                {mode === 'login' ? 'Sucesso! Entrando...' : 'Conta criada com sucesso!'}
                <p className="text-xs font-medium text-bioma-moss mt-0.5">{status.email}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bioma-muted mb-1.5 ml-1">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-bioma-muted">
                <Mail size={18} aria-hidden="true" />
              </span>
              <input
                type="email"
                required
                disabled={status.type === 'loading' || status.type === 'success'}
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-bioma-sand border border-bioma-border rounded-organic-sm font-semibold text-bioma-bark placeholder-bioma-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus:border-bioma-leaf focus:bg-bioma-card transition-all disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bioma-muted mb-1.5 ml-1">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-bioma-muted">
                <Lock size={18} aria-hidden="true" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={status.type === 'loading' || status.type === 'success'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-bioma-sand border border-bioma-border rounded-organic-sm font-semibold text-bioma-bark placeholder-bioma-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus:border-bioma-leaf focus:bg-bioma-card transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowPassword(!showPassword);
                }}
                disabled={status.type === 'loading' || status.type === 'success'}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha em texto claro'}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-bioma-muted hover:text-bioma-bark transition-colors disabled:opacity-60 cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Botão de Envio */}
          <PrimaryButton3D
            type="submit"
            variant="leaf"
            disabled={status.type === 'loading' || status.type === 'success'}
            className="w-full mt-2"
          >
            {status.type === 'loading' ? (
              <>
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                <span>Processando...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Entrar' : 'Registrar-se'}</span>
            )}
          </PrimaryButton3D>
        </form>

        {/* Divisor */}
        <div className="relative flex items-center my-5">
          <div className="flex-grow border-t border-bioma-border"></div>
          <span className="flex-shrink mx-3 text-xs font-extrabold text-bioma-muted uppercase tracking-widest">
            Ou
          </span>
          <div className="flex-grow border-t border-bioma-border"></div>
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
            className="w-full py-2.5 bg-bioma-sand hover:bg-bioma-sand-dark text-bioma-bark font-bold text-sm rounded-organic-sm border border-bioma-border transition-colors disabled:opacity-60 cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
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
            className="w-full py-2 text-center text-xs font-semibold text-bioma-muted hover:text-bioma-bark hover:underline transition-all cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2"
          >
            Continuar em Modo Offline
          </button>
        </div>

        {!isCloudEnabled && (
          <div className="mt-4 text-center text-xs font-bold text-bioma-amber bg-bioma-amber-soft rounded-organic-sm p-2 border border-bioma-amber/30">
            Conexão com a Nuvem desativada (Modo Sandbox Offline ativo).
          </div>
        )}
      </motion.div>
    </div>
  );
};
