# SideGuide Development Phases

## ✅ Phase 1: Core Infrastructure (DONE)

- [x] Next.js 14 project setup
- [x] Tailwind CSS configuration
- [x] TypeScript setup
- [x] Git initialization
- [x] Supabase setup guide
- [x] Database schema SQL
- [x] RLS policies
- [x] Type definitions

**Status**: Ready for Supabase setup + Phase 2

**Next**: 
1. Create Supabase project
2. Run SQL schema
3. Configure Google OAuth
4. Update .env.local

---

## Phase 2: Home Page + Browse (Next)

**Tasks**:
- [ ] Create landing page with CTA
- [ ] Build guide card component
- [ ] Create `/guides` page
- [ ] Implement filtering (format, sort)
- [ ] Link to guide detail page
- [ ] Display decklist + sideguide on public view

**Estimated Time**: 3-4 hours

---

## Phase 3: Decklist Creation

**Tasks**:
- [ ] Create `/create` page
- [ ] Manual card search (Scryfall API)
- [ ] Add cards to main deck/sideboard
- [ ] Card removal + quantity selector
- [ ] Import from file (.dek, .txt, MTG Arena)
- [ ] Save decklist to database
- [ ] Redirect to sideguide builder

**Estimated Time**: 5-6 hours

---

## Phase 4: Sideboard Guide Builder

**Tasks**:
- [ ] Matchup list view
- [ ] "New Matchup" form (up to 20)
- [ ] Cards In selector (with images)
- [ ] Cards Out selector (with images)
- [ ] Validate in/out match
- [ ] Rich text editor for notes
- [ ] Matchup management (edit, delete, reorder)

**Estimated Time**: 6-7 hours

---

## Phase 5: Privacy + Sharing

**Tasks**:
- [ ] Public/private toggle on decklist
- [ ] Generate shareable link
- [ ] URL slug generation
- [ ] User dashboard (`/dashboard`)
- [ ] Edit/delete/share options
- [ ] Prevent unauthorized access

**Estimated Time**: 3-4 hours

---

## Phase 6: Polish + MVP Launch

**Tasks**:
- [ ] Responsive design (mobile-first)
- [ ] Dark mode (already built into Tailwind)
- [ ] Loading states + error handling
- [ ] Toast notifications
- [ ] Performance optimization
- [ ] Manual end-to-end testing
- [ ] Deploy to Vercel

**Estimated Time**: 3-4 hours

---

## Phase 7: Post-Launch Features (Optional)

**Tasks**:
- [ ] Like/favorite public guides
- [ ] Comment on guides
- [ ] User profiles
- [ ] "Top Guides" leaderboard
- [ ] Format validation
- [ ] Deck legality check
- [ ] Export guide as PDF
- [ ] MTGO/Arena integration

**Estimated Time**: 4-6 hours

---

## Timeline

- **Weeks 1-2**: Phases 1-3 (Core infrastructure + decklist creation)
- **Weeks 2-3**: Phase 4 (Sideboard guide builder)
- **Week 3-4**: Phase 5 (Privacy + sharing)
- **Week 4**: Phase 6 (Polish + MVP launch)
- **Weeks 5-6**: Phase 7 (Optional post-launch features)

---

## Current Status

**Last Updated**: 2026-03-24 19:43
**Phase**: 1 (COMPLETE)
**Next Phase**: 2 (HOME + BROWSE)

---

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint
npm run lint
```

---

## Key Files

- `src/lib/supabase.ts` - Supabase client
- `src/types/database.ts` - Database type definitions
- `SUPABASE_SETUP.md` - Supabase configuration
- `.env.local` - Environment variables (create from `.env.local.example`)
