# XSkill Setup Instructions - Complete Guide

Follow these steps **EXACTLY** to set up your XSkill application without errors.

---

## ⚠️ CRITICAL: Start Here

### Step 1: Run the Database Schema in Supabase

1. **Go to** https://supabase.com and sign in to your project
2. **Navigate to** SQL Editor (left sidebar)
3. **Click** "New Query"
4. **Open** the file `database/schema.sql` in your project
5. **Copy the ENTIRE contents** of that file
6. **Paste** into the Supabase SQL Editor
7. **Click "Run"** to execute

**✅ This creates:**
- All 8 database tables with correct column names
- Row Level Security policies
- Database triggers and functions
- 10 sample courses

**⚠️ IMPORTANT:** The column is named `user_role` (NOT `current_role`) to avoid SQL reserved keyword conflicts.

---

## Step 2: Configure Supabase Authentication

### 2.1 Email Authentication (Already Enabled)

Email/password auth is enabled by default in Supabase.

### 2.2 Disable Email Confirmation (For Development)

1. Go to **Authentication** → **Providers** → **Email**
2. **UNCHECK** "Confirm email"
3. Click **Save**

This allows you to sign up without email verification during development.

### 2.3 Configure Google OAuth (Optional but Recommended)

#### A. Get Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Select your project or create a new one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: XSkill
   - User support email: your email
   - Developer contact: your email
   - Save and continue through all steps
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: XSkill
   - Authorized JavaScript origins: (leave empty for now)
   - Authorized redirect URIs: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Get your Project Ref from Supabase Project Settings → General → Reference ID
7. **Copy** the Client ID and Client Secret

#### B. Add to Supabase

1. Go to your Supabase project
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to expand
4. Toggle **Enable** to ON
5. **Paste** your Client ID
6. **Paste** your Client Secret
7. Click **Save**

---

## Step 3: Environment Variables

Your `.env` file should already have these variables. **Verify they are correct:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL="XSkill <noreply@yourdomain.com>"
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**To get Supabase credentials:**
1. Go to **Project Settings** → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 4: Install Dependencies (If Not Done)

```bash
npm install
```

---

## Step 5: Start the Development Server

```bash
npm run dev
```

The app will run at http://localhost:3000

---

## Step 6: Test the Application

### 6.1 Test Sign Up

1. Visit http://localhost:3000
2. Click **"Get Started"** button
3. Fill in the sign up form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Click **"Create Account"**

**✅ Expected Result:**
- Success message appears
- You're redirected to `/dashboard`
- You see your dashboard with 0 credits and 0 XScore

**❌ If it fails:**
- Check browser console for errors
- Check Supabase logs (Dashboard → Logs → Error Logs)
- Verify database schema was run successfully
- Verify email confirmation is disabled

### 6.2 Test Dashboard

- Verify you see:
  - Your name in the welcome message
  - Credits: 0
  - XScore: 0
  - Role badge showing "Learner"
  - Navigation working

### 6.3 Test Role Switching

1. Click **Profile** in navigation
2. Click **Role** tab
3. Try switching to **Teacher** or **Swapper**
4. Confirm role changes in navigation bar

### 6.4 Test Teacher Verification

1. Switch role to **Teacher**
2. Click **Verification** tab
3. Fill in the form:
   - Degree URL: https://example.com/degree.pdf
   - Years of Experience: 5
   - Expertise Areas: Web Development, React
   - Additional Info: (optional)
4. Click **"Submit for Verification"**

**✅ Expected:**
- Success message
- Status shows "Pending"

**To Approve:**
1. Go to Supabase → **Table Editor** → **teacher_verifications**
2. Find your request
3. Change `status` to `'approved'`
4. Go to **users** table
5. Find your user
6. Set `teacher_status` to `'approved'`
7. Set `is_verified_teacher` to `true`
8. Refresh dashboard - you should now see "Verified: Yes"

### 6.5 Test Browse Courses

1. Click **Courses** in navigation
2. Verify you see 10 courses
3. Try search functionality
4. Try category filter
5. Try difficulty filter

### 6.6 Test Sign Out

1. Click **Sign Out** button
2. Verify you're redirected to landing page
3. Verify you can't access `/dashboard` without signing in

---

## Common Issues & Solutions

### Issue: "syntax error at or near current_role"

**Solution:** This is fixed. The schema uses `user_role` instead. Make sure you're running the latest `database/schema.sql` file.

### Issue: "Cannot find module './database.types'"

**Solution:** This file exists. Restart your dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

### Issue: Sign up fails silently

**Causes:**
1. Email confirmation is enabled
2. Database schema not run
3. RLS policies blocking access

**Solutions:**
1. Disable email confirmation (Step 2.2)
2. Re-run database schema (Step 1)
3. Check Supabase logs for specific error

### Issue: "Failed to sign up. Please try again"

**Check:**
1. Browser console for errors
2. Supabase Dashboard → Logs → Error Logs
3. Verify `.env` variables are correct
4. Verify you ran the complete schema SQL

### Issue: User created but profile not showing

**Solution:** The `handle_new_user()` trigger should create the profile automatically. Check:
1. Supabase → **Table Editor** → **users**
2. Verify trigger exists in schema
3. Manually insert a row if needed with your auth.users id

### Issue: Google OAuth not working

**Check:**
1. Redirect URI matches exactly: `https://[your-ref].supabase.co/auth/v1/callback`
2. OAuth consent screen is published
3. Client ID and Secret are correct in Supabase

---

## Database Structure Overview

Your database has these tables:

1. **users** - User profiles with role, credits, XScore
2. **courses** - Available skills/courses (10 pre-seeded)
3. **sessions** - Scheduled learning sessions
4. **transactions** - Credit transaction history
5. **subscriptions** - User subscriptions
6. **notifications** - User notifications
7. **teacher_verifications** - Teacher verification requests
8. **early_signups** - Early access email list

---

## What's Working

✅ **Authentication**
- Email/password sign up and sign in
- Google OAuth ready
- Protected routes
- Session persistence

✅ **User Roles**
- Learner, Teacher, Swapper
- Role switching
- Role-specific features

✅ **Teacher Verification**
- Submit verification request
- Track status (pending/approved/rejected)
- Restrict teaching to verified users

✅ **Credits & XScore**
- Display in navigation
- Database structure ready
- Logic ready for session completion

✅ **Courses**
- Browse 10 sample courses
- Search and filter
- Responsive cards

✅ **Dashboard**
- Personalized welcome
- Stats overview
- Quick actions
- Role status

✅ **Sessions**
- View upcoming/past sessions
- Filter by status
- Session details

✅ **Profile**
- Update name and bio
- Switch roles
- Submit teacher verification

---

## Next Steps After Setup

1. **Create more courses** in Supabase Table Editor
2. **Implement session booking** (book sessions with teachers)
3. **Add credit deduction logic** (when sessions complete)
4. **Build admin panel** (approve teacher verifications)
5. **Add real-time notifications**
6. **Integrate video calling** (Zoom, Google Meet)
7. **Add payment system** (Stripe for subscriptions)

---

## Production Deployment

When ready to deploy:

1. **Push to GitHub**
2. **Deploy to Vercel** (connect repo)
3. **Add environment variables** in Vercel dashboard
4. **Update Supabase redirect URLs** to your Vercel domain
5. **Test production build** thoroughly
6. **Enable email confirmation** in production

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

---

## Support

If you encounter issues:

1. **Check browser console** for client-side errors
2. **Check Supabase logs** for server-side errors
3. **Verify all steps** were followed exactly
4. **Review this guide** for troubleshooting

**Common Mistake:** Skipping Step 1 (database schema). The app WILL NOT work without running the SQL schema first.

---

## ✅ Checklist Before Testing

- [ ] Ran complete `database/schema.sql` in Supabase SQL Editor
- [ ] Disabled email confirmation in Supabase
- [ ] Verified `.env` variables are correct
- [ ] Ran `npm install`
- [ ] Started dev server with `npm run dev`
- [ ] Can access http://localhost:3000

If all checked, you're ready to test sign up!

---

**🎉 Your XSkill application is ready to use!**
