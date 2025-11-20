# XSkill Landing Page

A modern, responsive landing page for XSkill - Skill Exchange Platform.

## Features

- 🎨 Modern, clean design with Tailwind CSS
- 📱 Fully responsive (mobile-first)
- ⚡ Fast and optimized with Next.js 14
- 🎯 Email collection for early access
- 📧 Automated thank-you emails via Resend
- 💾 Supabase database integration
- ✨ Smooth animations and transitions
- 🎭 Gradient backgrounds with brand colors (Orange & Teal)

## Getting Started

### 1. Install Dependencies

```bash
cd demo
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL from `database/early_access_table.sql`
3. Copy your Supabase URL and anon key from **Settings > API**

### 3. Set Up Resend (for Email)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain or use the test domain

### 4. Environment Variables

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 5. Add Images

Place your images in the `public` folder:
- `logo.png` - XSkill logo (used in Navbar and Hero)
- `screenshots/dashboard.png` - Dashboard screenshot
- `screenshots/skills.png` - Skills screenshot
- `screenshots/credits.png` - Credits screenshot
- `screenshots/xscore.png` - XScore screenshot
- `screenshots/sessions.png` - Sessions screenshot

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
demo/
├── app/
│   ├── api/
│   │   └── early-access/
│   │       └── route.ts      # Email collection API with Resend
│   ├── components/           # React components
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── Features.tsx
│   ├── XScore.tsx
│   ├── EarlyAccess.tsx
│   ├── Screenshots.tsx
│   └── Footer.tsx
├── lib/
│   └── supabase.ts          # Supabase client
├── database/
│   └── early_access_table.sql  # Database schema
└── public/
    ├── logo.png
    └── screenshots/
```

## API Endpoint

### POST `/api/early-access`

Collects email addresses, saves to Supabase, and sends thank-you email via Resend.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully signed up for early access! Check your email for confirmation.",
  "data": { ... }
}
```

**Features:**
- Validates email format
- Checks for duplicate emails
- Stores in Supabase `early_signups` table
- Sends automated thank-you email via Resend
- Returns appropriate error messages

## Brand Colors

- **Primary (Orange)**: `#f97316` - Main brand color
- **Accent (Teal)**: `#14b8a6` - Secondary brand color

These colors are used throughout the design for gradients, buttons, and highlights.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Hot Toast
- Supabase (for email storage)
- Resend (for email sending)

## Customization

- Colors: Edit `tailwind.config.js` to change theme colors
- Content: Update component files in `components/` directory
- Styling: Modify Tailwind classes or add custom CSS in `globals.css`
- Email Template: Edit the HTML template in `app/api/early-access/route.ts`
