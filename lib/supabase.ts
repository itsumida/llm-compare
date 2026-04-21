import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Server-side client with service key (for API routes)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Types for database tables
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  credits: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  stripe_session_id: string;
  credits: number;
  amount_cents: number;
  created_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  models_count: number;
  created_at: string;
}

// Helper functions for user management
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function createUser(email: string, name: string | null, image: string | null): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      name,
      image,
      credits: 10, // Free credits on signup
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getOrCreateUser(email: string, name: string | null, image: string | null): Promise<User> {
  const existingUser = await getUserByEmail(email);
  if (existingUser) return existingUser;
  return createUser(email, name, image);
}

export async function getUserCredits(email: string): Promise<number> {
  const user = await getUserByEmail(email);
  return user?.credits ?? 0;
}

export async function deductCredit(email: string, modelsCount: number): Promise<{ success: boolean; credits: number }> {
  const user = await getUserByEmail(email);
  if (!user || user.credits < 1) {
    return { success: false, credits: user?.credits ?? 0 };
  }

  const { data, error } = await supabase
    .from('users')
    .update({ credits: user.credits - 1 })
    .eq('email', email)
    .select()
    .single();

  if (error) {
    return { success: false, credits: user.credits };
  }

  // Log usage
  await supabase.from('usage').insert({
    user_id: user.id,
    models_count: modelsCount,
  });

  return { success: true, credits: (data as User).credits };
}

export async function addCredits(email: string, credits: number, stripeSessionId: string, amountCents: number): Promise<User> {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('User not found');

  // Update user credits
  const { data, error } = await supabase
    .from('users')
    .update({ credits: user.credits + credits })
    .eq('email', email)
    .select()
    .single();

  if (error) throw error;

  // Record purchase
  await supabase.from('purchases').insert({
    user_id: user.id,
    stripe_session_id: stripeSessionId,
    credits,
    amount_cents: amountCents,
  });

  return data as User;
}

export async function getUserPurchases(email: string): Promise<Purchase[]> {
  const user = await getUserByEmail(email);
  if (!user) return [];

  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Purchase[];
}
