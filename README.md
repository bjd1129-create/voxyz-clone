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

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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
│   └── vault/page.tsx    # Signup
├── lib/
│   └── supabase.ts       # Database client
└── components/           # Shared components
```

## License

MIT