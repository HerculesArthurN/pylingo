/**
 * supabaseClient.ts
 *
 * Cliente Supabase resiliente offline-first.
 * 
 * Contrato (DbC):
 *   - Pré-condição: Se `isCloudEnabled` for verdadeiro, `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
 *                   devem ser strings válidas e não vazias.
 *   - Pós-condição: Exporta o cliente `supabase` ativo ou `null` caso as credenciais não estejam configuradas.
 *   - Invariante: Se `isCloudEnabled` for falso, operações de sincronização em nuvem não devem ocorrer,
 *                 forçando o aplicativo a atuar em modo offline/convidado resiliente.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isCloudEnabled = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'undefined' &&
  supabaseAnonKey !== 'undefined' &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== ''
);

export const supabase: SupabaseClient | null = isCloudEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
