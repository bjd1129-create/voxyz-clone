# VoxYZ Clone

A clone of voxyz.space - an AI team that runs itself.

## Features

- 🏠 Landing page
- 🎮 Command Center (/swarm) - Real-time agent status
- 🏢 Pixel Office (/office) - Animated agent workspace
- 📡 Demand Radar (/radar) - Market demand signals
- 📝 Insights (/insights) - Blog posts
- 🔐 Vault (/vault) - Early access signup

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- OpenClaw (AI Agents)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 7x24 Automation Infrastructure Setup

This project includes infrastructure for 24/7 automated operations. To fully set it up:

### 1. Database Setup
Execute the ops tables schema in your Supabase project:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/sql/new
2. Copy and run the SQL from `supabase/ops-tables.sql`

### 2. Vercel Cron Configuration
The `vercel.json` file is already configured with:
```json
{
  "crons": [
    // ... existing crons
    {
      "path": "/api/heartbeat",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 3. API Endpoints
- Heartbeat monitoring: `/api/heartbeat` - Runs every 5 minutes via Vercel Cron
- Ops tables setup: `/api/setup-ops-tables` - For managing operational tables

### 4. Operational Tables
The system uses these tables for automation:
- `ops_mission_proposals` - Track mission proposals
- `ops_missions` - Active missions
- `ops_mission_steps` - Mission steps
- `ops_agent_events` - Agent events
- `ops_trigger_rules` - Automation triggers
- `ops_policy` - Operational policies
- `ops_agent_reactions` - Agent reactions to events

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for ops tables
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home
│   ├── swarm/page.tsx    # Command Center
│   ├── office/page.tsx   # Pixel Office
│   ├── radar/page.tsx    # Demand Radar
│   ├── insights/page.tsx # Blog
│   ├── api/
│   │   ├── heartbeat/route.ts    # Heartbeat monitoring
│   │   └── setup-ops-tables/     # Ops tables setup
│   └── vault/page.tsx    # Signup
├── lib/
│   └── supabase.ts       # Database client
└── components/           # Shared components
```

## License

MIT