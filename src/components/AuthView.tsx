import React, { useState, useEffect } from 'react';
import { Mail, Lock, X, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Mascot } from './Mascot';
import { MascotMood } from '../core/types';
import { supabase, isCloudEnabled } from '../core/supabaseClient';
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
      setStatus({ type: 'error', message: 'E-mail inválido.' });
      playSound('error');
      return;
    }

    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Senha mínima de 6 caracteres.' });
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
          if (!data.user) throw new Error('Erro servidor.');

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
          if (!data.user) throw new Error('Falha no cadastro.');

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
      console.error('Erro Auth:', err);
      setStatus({
        type: 'error',
        message: err.message || 'Erro inesperado.',
      });
      playSound('error');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Autenticação"
      className="modal-backdrop"
    >
      <div className="relative w-full max-w-md bg-base-100 border-2 border-base-900 shadow-brutal p-6 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-base-500 hover:text-base-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Fechar"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <div className="mb-4">
            <Mascot mood={mascotMood} size="h-20 w-20" />
          </div>
          <h2 className="text-xl font-bold font-pixel tracking-tighter text-center uppercase">
            {mode === 'login' ? 'Login' : 'Registrar'}
          </h2>
        </div>

        {/* Feedback */}
        {status.type === 'error' && (
          <div className="flex items-start gap-2.5 p-3 mb-4 text-sm text-base-50 bg-error border-2 border-base-900 shadow-brutal">
            <AlertCircle className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="font-bold leading-snug">{status.message}</div>
          </div>
        )}

        {status.type === 'success' && (
          <div className="flex items-start gap-2.5 p-3 mb-4 text-sm text-base-900 bg-success border-2 border-base-900 shadow-brutal">
            <CheckCircle2 className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="font-bold leading-snug">
              {mode === 'login' ? 'Entrando...' : 'Conta criada!'}
              <p className="text-xs font-medium mt-0.5">{status.email}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
              E-mail
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-500">
                <Mail size={18} aria-hidden="true" />
              </span>
              <input
                type="email"
                required
                disabled={status.type === 'loading' || status.type === 'success'}
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-base-50 border-2 border-base-900 font-mono text-sm placeholder-base-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:border-accent disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1">
              Senha
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-500">
                <Lock size={18} aria-hidden="true" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={status.type === 'loading' || status.type === 'success'}
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-base-50 border-2 border-base-900 font-mono text-sm placeholder-base-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:border-accent disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowPassword(!showPassword);
                }}
                disabled={status.type === 'loading' || status.type === 'success'}
                aria-label={showPassword ? 'Ocultar' : 'Exibir'}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-base-500 hover:text-base-900 disabled:opacity-60"
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>

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
              <span>{mode === 'login' ? 'ENTRAR' : 'REGISTRAR'}</span>
            )}
          </PrimaryButton3D>
        </form>

        <div className="flex flex-col gap-2 mt-6">
          <button
            type="button"
            disabled={status.type === 'loading' || status.type === 'success'}
            onClick={() => {
              playSound('click');
              setMode(mode === 'login' ? 'register' : 'login');
              setStatus({ type: 'idle' });
            }}
            className="w-full py-2 bg-base-200 hover:bg-base-300 text-base-900 font-bold text-xs uppercase rounded-none border-2 border-base-900 transition-colors disabled:opacity-60"
          >
            {mode === 'login'
              ? 'Criar conta'
              : 'Já tem conta? Entrar'}
          </button>

          <button
            type="button"
            disabled={status.type === 'loading' || status.type === 'success'}
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-full py-2 text-center text-xs font-bold text-base-500 hover:text-base-900 hover:underline transition-all"
          >
            Offline Mode
          </button>
        </div>

        {!isCloudEnabled && (
          <div className="mt-4 text-center text-[10px] font-bold text-warning uppercase border-2 border-warning p-2">
            Cloud desativada. Offline Sandbox.
          </div>
        )}
      </div>
    </div>
  );
};
