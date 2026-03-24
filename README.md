# SideGuide - MTG Sideboard Guide Builder

Create and share MTG sideboard guides with visual matchup layouts.

## Features

- **Decklist Management**: Import from MTG Arena, .dek files, or manually add cards
- **Sideboard Guides**: Build guides for up to 20 matchups per deck
- **Visual Layouts**: Select cards with Scryfall images for in/out sideboard swaps
- **Matchup Notes**: Add detailed notes and strategy tips for each matchup
- **Print Support**: Generate A4-sized printable guides
- **Public/Private Sharing**: Share guides via link with public/private privacy settings
- **Google OAuth**: Simple sign-in with Google

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Card Data**: Scryfall API
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and add your Supabase keys
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Open `http://localhost:3000`

## Project Structure

```
src/
  ├── app/              # Next.js app router
  ├── components/       # React components
  ├── lib/              # Utilities (Supabase client, helpers)
  ├── types/            # TypeScript types
  └── styles/           # Global styles
```

## Development

See PHASES.md for detailed development roadmap.

## License

MIT
