-- LLM Compare Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases table
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_session_id TEXT UNIQUE,
  credits INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage log (for analytics)
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  models_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Create indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_usage_user_id ON usage(user_id);
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);
