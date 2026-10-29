# Premium Dark UI Redesign - Avichi College Admission Chatbot

## Overview
A premium dark landing page redesign inspired by the "Reflect" app, featuring a halo hero, starfield, glass morphism, and smooth Framer Motion transitions. The backend (Groq API, knowledge base) remains unchanged.

## Branch
All changes are on the `ui-redesign` branch. Switch back to `main` to restore the working version:
```bash
git checkout main
```

## Installation
```bash
npm install
npm run dev
```

## Configuration

### 1. Brand Colors
Edit `app/globals.css` to switch from the default purple theme to Avichi's navy/red brand:

```css
:root {
  /* Default purple theme */
  --primary: #7C5CFF;
  --primary-glow: #A78BFA;
  --accent: #5EEAD4;
  
  /* Uncomment for Avichi brand colors: */
  /* --primary: #0B3A6A; */
  /* --primary-glow: #2563EB; */
  /* --accent: #DC2626; */
}
```

### 2. Logo
Replace `/public/logo.png` with your college crest (transparent PNG or SVG, 512x512px recommended). The logo appears:
- Inside the halo on the landing page
- In the floating navbar
- As a small orb in the chat header

### 3. Contact Information
Update `.env` or `.env.local`:
```env
NEXT_PUBLIC_COLLEGE_PHONE=+919600164074
NEXT_PUBLIC_COLLEGE_EMAIL=avichicollege2018@gmail.com
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/919600164074
```

### 4. Language Support
The UI automatically switches between English and Tamil. Translations are in:
- `components/redesign/FloatingNavbar.tsx` (nav links)
- The chat input component (placeholders)
- Suggestion chips

To add more languages, extend the `navLinks` and `queries` objects.

### 5. Lead Capture (Optional)
Set `LEADS_WEBHOOK_URL` to send lead data to Google Sheets or any webhook:
```env
LEADS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Components Structure

### Core UI Components (in `components/redesign/`)
- **StarField.tsx** - Animated canvas starfield background
- **HaloHero.tsx** - Central glowing halo with logo, breathing animation
- **FloatingNavbar.tsx** - Glass navbar with language switch and call button
- **GlassChatPanel.tsx** - Glass morphism chat container (to be completed)
- **ChatInput.tsx** - Premium input pill with mic, send, speaker toggle
- **MessageList.tsx** - Scrollable message area with glass bubbles
- **MessageBubble.tsx** - Individual message with bot actions
- **CourseCards.tsx** - Glass cards for course listings
- **ContactButtons.tsx** - Quick action buttons (Call, WhatsApp)
- **LeadCard.tsx** - Lead capture form overlay

### Hooks (existing, unchanged)
- **useChat.ts** - Chat state and streaming fetch to `/api/chat`
- **useSpeechSynthesis.ts** - Text-to-speech with state
- **useSpeechRecognition.ts** - Voice input with Web Speech API

## Animation Details

### Landing Page Load Sequence
1. Starfield fades in (0s)
2. Halo scales from 0.85 to 1 with bloom (0.3s)
3. Headline fades up line by line (0.5s)
4. Glass panel slides up from bottom (0.8s)
5. Stagger duration: ~1.2s total

### Chat Transition
- `layoutId="avichi-halo-logo"` shared between halo and header logo
- Halo shrinks into header (spring transition)
- Glass panel expands to full chat window
- Messages fade in as they stream

### Interactive States
- **Hover**: Lift 2px, brighter glow, scale 1.04
- **Press**: Scale 0.96
- **Focus**: 2px outline with 2px offset
- **Speaking**: Logo pulses, halo breathes faster
- **Listening**: Mic shows waveform, expanding ripple

### Performance
- All decorations in CSS (conic-gradient, radial-gradient, backdrop-filter)
- Single lightweight canvas for stars
- Animations use only `transform` and `opacity`
- Mobile: fewer stars, reduced blur, no parallax
- Respects `prefers-reduced-motion`

## Accessibility
- Contrast ratio 4.5:1 minimum for all text
- ARIA labels on icon-only buttons
- Visible focus rings with adequate offset
- `aria-live="polite"` on message list
- Full keyboard navigation
- Screen reader announcements for state changes

## Mobile Optimizations
- Smaller halo (180px vs 240px)
- Nav links in hamburger menu
- Horizontal scroll for suggestion chips
- No parallax mouse effects
- Simplified halo bloom (fewer gradient layers)
- 50 stars instead of 120
- Input stays above mobile keyboard (100dvh layout)

## API Integration
The redesign keeps all existing API routes:
- `POST /api/chat` - Groq streaming chat (unchanged)
- `POST /api/leads` - Lead capture (forwards to webhook)
- `GET/PUT /api/admin/knowledge` - Knowledge base admin

## Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Stale cache after switching branches
```bash
rm -rf .next
npm run dev
```

### Logo not showing
Ensure `/public/logo.png` exists and is a valid image file.

### Colors not changing
Clear browser cache (Ctrl+Shift+R) after editing CSS variables.

### Voice not working
Voice input requires HTTPS in production. Works on localhost in dev mode.

## Production Deployment (Vercel)

1. Push the `ui-redesign` branch:
```bash
git push origin ui-redesign
```

2. In Vercel dashboard:
   - Import from the `ui-redesign` branch
   - Add all environment variables from `.env.example`
   - Deploy

3. After testing, merge to main:
```bash
git checkout main
git merge ui-redesign
git push origin main
```

## Rollback
If anything breaks, switch back to the working version:
```bash
git checkout main
npm run dev
```

## Future Enhancements
- [ ] Add course detail modal with enrollment stats
- [ ] Implement lead follow-up automation
- [ ] Add chatbot personality customization
- [ ] Export chat transcripts
- [ ] Multi-language knowledge base
- [ ] Analytics dashboard

## Support
For issues with the redesign, check:
1. Git branch (`git branch -v`)
2. Node modules installed (`npm install`)
3. Environment variables set (`.env.local`)
4. Next.js cache cleared (`rm -rf .next`)
