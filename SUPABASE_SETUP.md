# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. Copy your **Project URL** and **Anon Key**
4. Paste them into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 2. Setup Google OAuth

1. In Supabase Dashboard → Authentication → Providers
2. Enable **Google** provider
3. Add Google OAuth credentials (get from Google Cloud Console)
4. Set redirect URL: `https://your-domain.com/auth/callback`

## 3. Create Database Schema

Run these SQL queries in the Supabase SQL editor:

### Users Table (auto-created by Supabase Auth)
Already handled by Supabase Auth

### Decklists Table
```sql
CREATE TABLE decklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  format VARCHAR(50) NOT NULL, -- "standard", "pioneer", "modern", etc.
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX decklists_user_id ON decklists(user_id);
CREATE INDEX decklists_is_public ON decklists(is_public);
```

### Decklist Cards Table
```sql
CREATE TABLE decklist_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  decklist_id UUID REFERENCES decklists(id) ON DELETE CASCADE NOT NULL,
  card_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 4),
  is_sideboard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX decklist_cards_decklist_id ON decklist_cards(decklist_id);
```

### Sideguides Table
```sql
CREATE TABLE sideguides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  decklist_id UUID REFERENCES decklists(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX sideguides_decklist_id ON sideguides(decklist_id);
```

### Sideguide Matchups Table
```sql
CREATE TABLE sideguide_matchups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sideguide_id UUID REFERENCES sideguides(id) ON DELETE CASCADE NOT NULL,
  matchup_name VARCHAR(255) NOT NULL,
  notes TEXT,
  cards_in JSONB DEFAULT '[]'::jsonb, -- Array of {card_name, quantity}
  cards_out JSONB DEFAULT '[]'::jsonb, -- Array of {card_name, quantity}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX sideguide_matchups_sideguide_id ON sideguide_matchups(sideguide_id);
```

## 4. Setup Row-Level Security (RLS)

### Enable RLS on all tables
```sql
ALTER TABLE decklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE decklist_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE sideguides ENABLE ROW LEVEL SECURITY;
ALTER TABLE sideguide_matchups ENABLE ROW LEVEL SECURITY;
```

### Decklists RLS Policy
```sql
-- Users can select their own decklists OR public decklists
CREATE POLICY "Users can view own or public decklists"
  ON decklists
  FOR SELECT
  USING (
    auth.uid() = user_id OR is_public = TRUE
  );

-- Users can insert their own decklists
CREATE POLICY "Users can insert own decklists"
  ON decklists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own decklists
CREATE POLICY "Users can update own decklists"
  ON decklists
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own decklists
CREATE POLICY "Users can delete own decklists"
  ON decklists
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Decklist Cards RLS Policy
```sql
-- Users can view cards from decklists they can view
CREATE POLICY "Users can view decklist cards"
  ON decklist_cards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decklists
      WHERE decklists.id = decklist_cards.decklist_id
      AND (decklists.user_id = auth.uid() OR decklists.is_public = TRUE)
    )
  );

-- Users can manage cards on their decklists
CREATE POLICY "Users can manage own decklist cards"
  ON decklist_cards
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM decklists
      WHERE decklists.id = decklist_cards.decklist_id
      AND decklists.user_id = auth.uid()
    )
  );
```

### Sideguides RLS Policy (same as decklists)
```sql
CREATE POLICY "Users can view sideguides"
  ON sideguides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decklists
      WHERE decklists.id = sideguides.decklist_id
      AND (decklists.user_id = auth.uid() OR decklists.is_public = TRUE)
    )
  );

CREATE POLICY "Users can manage own sideguides"
  ON sideguides
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM decklists
      WHERE decklists.id = sideguides.decklist_id
      AND decklists.user_id = auth.uid()
    )
  );
```

### Sideguide Matchups RLS Policy
```sql
CREATE POLICY "Users can view matchups"
  ON sideguide_matchups
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sideguides
      JOIN decklists ON decklists.id = sideguides.decklist_id
      WHERE sideguides.id = sideguide_matchups.sideguide_id
      AND (decklists.user_id = auth.uid() OR decklists.is_public = TRUE)
    )
  );

CREATE POLICY "Users can manage own matchups"
  ON sideguide_matchups
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sideguides
      JOIN decklists ON decklists.id = sideguides.decklist_id
      WHERE sideguides.id = sideguide_matchups.sideguide_id
      AND decklists.user_id = auth.uid()
    )
  );
```

## 5. Test Connection

Run this in your app to test:
```bash
npm run dev
# Check browser console for Supabase connection
```

Done! Your Supabase project is ready.
