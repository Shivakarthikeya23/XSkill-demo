# XSkill Landing Page - Complete Setup Guide

## Quick Setup

### Step 1: Install Dependencies

```bash
cd demo
npm install
```

### Step 2: Set Up Supabase Database

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `database/early_access_table.sql`
4. Click **Run** to create the `early_signups` table

The table will be created with:
- `id` - UUID primary key
- `email` - Unique email address
- `created_at` - Timestamp
- `notified` - Boolean flag for notification status
- `notified_at` - Timestamp when notified

### Step 3: Set Up Resend (for Email)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain or use the test domain (`onboarding@resend.dev`)

### Step 4: Environment Variables

Create `.env.local` file in the `demo` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bpxvedjtzbppnggreabh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note:** If you don't have a verified domain, use `onboarding@resend.dev` for testing.

### Step 5: Add Images

Place your images in the `public` folder:

```
demo/public/
├── logo.png                    # XSkill logo (required)
└── screenshots/
    ├── dashboard.png          # Dashboard screenshot
    ├── skills.png             # Skills screenshot
    ├── credits.png            # Credits screenshot
    ├── xscore.png             # XScore screenshot
    └── sessions.png           # Sessions screenshot
```

**Important:** 
- Copy `logo.png` from `frontend/public/logo.png` to `demo/public/logo.png`
- Add your 5 screenshot images to `demo/public/screenshots/`

### Step 6: Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## How It Works

When users sign up for early access:

1. ✅ Email is validated (format check)
2. ✅ System checks if email already exists (prevents duplicates)
3. ✅ Email is stored in Supabase `early_signups` table
4. ✅ Thank-you email is sent via Resend
5. ✅ User receives success notification

## Viewing Signups

To view all early access signups:

1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Select `early_signups` table
4. View all signups with timestamps

## Email Template

The thank-you email includes:
- Welcome message
- XSkill branding (orange & teal colors)
- What to expect next
- Contact information

You can customize the email template in `app/api/early-access/route.ts`

## Brand Colors

- **Primary (Orange)**: `#f97316` - Used for main brand elements
- **Accent (Teal)**: `#14b8a6` - Used for secondary elements

These colors match the XSkill logo and are used throughout the design.

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` exists with correct values
- Restart the dev server after adding env variables

**Error: "relation 'early_signups' does not exist"**
- Run the SQL from `database/early_access_table.sql` in Supabase SQL Editor

**Error: "Resend API error"**
- Check your `RESEND_API_KEY` is correct
- Make sure `RESEND_FROM_EMAIL` is verified in Resend dashboard
- For testing, use `onboarding@resend.dev`

**Logo not showing:**
- Make sure `logo.png` exists in `demo/public/logo.png`
- Check the file path is correct

**Screenshots not showing:**
- Make sure all 5 screenshot images are in `demo/public/screenshots/`
- Images will fallback to gradient placeholders if not found
