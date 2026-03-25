-- Run this in Supabase SQL Editor
-- Creates the two tables needed for marvistalaw.com

-- Table 1: Generated page content (33,540 rows)
CREATE TABLE IF NOT EXISTS marvistalaw_pages (
  id            BIGSERIAL PRIMARY KEY,
  city_slug     TEXT NOT NULL,
  service_slug  TEXT NOT NULL,
  city_name     TEXT NOT NULL,
  county        TEXT,
  county_slug   TEXT,
  service_name  TEXT NOT NULL,
  service_category TEXT,
  lead_price    INTEGER,
  ms360_path    TEXT,
  ms360_price   INTEGER,
  lat           DECIMAL(10,6),
  lng           DECIMAL(10,6),
  courthouse    TEXT,
  recorder      TEXT,
  content       JSONB,        -- Full AI-generated content as JSON
  generated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_slug, service_slug)
);

-- Index for fast page lookups
CREATE INDEX IF NOT EXISTS idx_mvl_pages_lookup
  ON marvistalaw_pages(city_slug, service_slug);

CREATE INDEX IF NOT EXISTS idx_mvl_pages_service
  ON marvistalaw_pages(service_slug);

CREATE INDEX IF NOT EXISTS idx_mvl_pages_county
  ON marvistalaw_pages(county_slug);

-- Table 2: Leads captured from forms
CREATE TABLE IF NOT EXISTS marvistalaw_leads (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  email         TEXT,
  language      TEXT DEFAULT 'es',
  service       TEXT,
  service_slug  TEXT,
  city          TEXT,
  county        TEXT,
  lead_price    INTEGER,
  status        TEXT DEFAULT 'new',   -- new | contacted | sold | closed
  sold_to       TEXT,                 -- attorney email when sold
  sold_price    INTEGER,
  source        TEXT DEFAULT 'marvistalaw.com',
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lead management
CREATE INDEX IF NOT EXISTS idx_mvl_leads_status
  ON marvistalaw_leads(status);

CREATE INDEX IF NOT EXISTS idx_mvl_leads_service
  ON marvistalaw_leads(service_slug);

-- Enable RLS
ALTER TABLE marvistalaw_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marvistalaw_leads ENABLE ROW LEVEL SECURITY;

-- Pages are publicly readable (SEO pages)
CREATE POLICY "Pages are public" ON marvistalaw_pages
  FOR SELECT USING (true);

-- Leads: anyone can insert, only service role can read
CREATE POLICY "Anyone can submit lead" ON marvistalaw_leads
  FOR INSERT WITH CHECK (true);

-- marvistalaw_pages: service role can insert/update (for generator script)
CREATE POLICY "Service role can manage pages" ON marvistalaw_pages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read leads" ON marvistalaw_leads
  FOR SELECT USING (auth.role() = 'service_role');
