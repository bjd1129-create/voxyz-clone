-- VoxYZ Clone Database Schema

-- Agents table
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  current_task TEXT,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT REFERENCES agents(id),
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents(id),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals table (for agent ideas)
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memory table (for agent learning)
CREATE TABLE memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT REFERENCES agents(id),
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE events;

-- Insert default agents
INSERT INTO agents (id, name, role, emoji, color) VALUES
  ('ceo', 'CEO Minion', 'Decision Maker', '🎯', '#FF6B6B'),
  ('creative', 'Creative', 'Design Lead', '🎨', '#A855F7'),
  ('developer', 'Developer', 'Tech Lead', '💻', '#3B82F6'),
  ('writer', 'Writer', 'Content Lead', '📝', '#10B981'),
  ('researcher', 'Researcher', 'Analysis Lead', '🔍', '#F59E0B'),
  ('support', 'Support', 'Customer Success', '🛠️', '#EC4899');

-- Create indexes
CREATE INDEX idx_tasks_assignee ON tasks(assignee);
CREATE INDEX idx_events_agent ON events(agent_id);
CREATE INDEX idx_events_created ON events(created_at DESC);