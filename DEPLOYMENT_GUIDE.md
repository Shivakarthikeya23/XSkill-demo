# XSkill Deployment Guide

This guide will walk you through deploying the XSkill application from start to finish.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com) - Optional for deployment
- A Resend account (https://resend.com) - For email notifications
- Gmail account (for nodemailer backup)

---

## 🗄️ Step 1: Database Setup (Supabase)

### 1.1 Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: XSkill
   - **Database Password**: (Save this securely)
   - **Region**: Choose closest to your users
4. Wait for the project to be provisioned (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase project, navigate to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the SQL editor
5. Click **Run** to execute

This will create:
- All tables (users, courses, sessions, transactions, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Database functions and triggers
- Seed data with 10 sample courses

### 1.3 Enable Authentication Providers

1. Navigate to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider (enabled by default)
3. Enable **Google** provider (optional but recommended):
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### 1.4 Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## 📧 Step 2: Email Setup

### Option A: Resend (Recommended)

1. Go to https://resend.com and create an account
2. Verify your domain (or use resend.dev for testing)
3. Create an API key
4. Copy the API key for your `.env` file

### Option B: Gmail/Nodemailer

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification → App Passwords
3. Generate an app password for "Mail"
4. Use this password in your `.env` file

---

## ⚙️ Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="XSkill <noreply@yourdomain.com>"

# Email (Gmail/Nodemailer - Backup)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: For development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Step 4: Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Test the Application

1. **Landing Page**: Visit http://localhost:3000
2. **Sign Up**: Click "Get Started" → Create an account
3. **Dashboard**: You should be redirected to `/dashboard`
4. **Browse Courses**: Navigate to Courses page
5. **Switch Roles**: Go to Profile → Role tab
6. **Submit Verification**: Go to Profile → Verification tab (if testing teacher role)

---

## 🌐 Step 5: Deploy to Vercel

### 5.1 Connect Your Repository

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository

### 5.2 Configure Environment Variables

In Vercel project settings, add all environment variables from `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
EMAIL_USER
EMAIL_PASS
```

### 5.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (~2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

### 5.4 Update Redirect URLs

1. Go back to Supabase → **Authentication** → **URL Configuration**
2. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: `https://your-project.vercel.app/**`

---

## 🔧 Step 6: Post-Deployment Configuration

### 6.1 Test Authentication

1. Visit your deployed site
2. Sign up with a new account
3. Verify email functionality
4. Test Google OAuth (if enabled)

### 6.2 Admin Access (Optional)

To approve teacher verifications, you'll need to access Supabase directly:

1. Go to **Table Editor** → **teacher_verifications**
2. Find pending verifications
3. Update the `status` field to `'approved'`
4. Update the user's `teacher_status` and `is_verified_teacher` in the **users** table

**Future Enhancement**: Create an admin dashboard for this.

### 6.3 Configure Email Templates

Update email templates in:
- `app/api/early-access/route.ts` - Early access confirmation
- Future: Add session confirmation emails

---

## 📊 Step 7: Database Monitoring

### Enable Supabase Realtime (Optional)

1. Go to **Database** → **Replication**
2. Enable replication for tables where you want real-time updates:
   - `sessions` - For live session updates
   - `notifications` - For instant notifications

### Set up Database Backups

1. Supabase automatically backs up your database
2. Go to **Database** → **Backups** to manage them
3. Consider setting up Point-in-Time Recovery for production

---

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign in with Google OAuth
- [ ] Email confirmation sent
- [ ] Session persistence works
- [ ] Sign out functionality

### User Roles
- [ ] Default role is "learner"
- [ ] Can switch to "teacher" role
- [ ] Can switch to "swapper" role
- [ ] Role switching updates correctly

### Teacher Verification
- [ ] Can submit verification request
- [ ] Verification status shows as "pending"
- [ ] After approval, can access teacher features
- [ ] Cannot teach without verification

### Courses
- [ ] Can browse all courses
- [ ] Search functionality works
- [ ] Filter by category works
- [ ] Filter by difficulty works
- [ ] Course cards display correctly

### Sessions
- [ ] Can view upcoming sessions
- [ ] Can view past sessions
- [ ] Session details display correctly
- [ ] Role in session (teacher/learner) shows correctly

### Credits & XScore
- [ ] Credits display in navigation
- [ ] XScore displays in navigation
- [ ] Credits update after actions (to be implemented in session booking)

### Profile
- [ ] Can update name and bio
- [ ] Email is read-only
- [ ] Profile updates save correctly
- [ ] Avatar handling (if implemented)

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem**: "Missing Supabase environment variables"
**Solution**: Ensure `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Authentication Not Working

**Problem**: Users can't sign in after signup
**Solution**: 
1. Check Supabase email confirmation settings
2. Verify redirect URLs in Supabase settings
3. Check browser console for errors

### Email Not Sending

**Problem**: Confirmation emails not received
**Solution**:
1. Check Resend/Gmail credentials
2. Verify email template in API route
3. Check spam folder
4. Review Vercel function logs

### RLS Policies Blocking Access

**Problem**: "permission denied for table users"
**Solution**:
1. Verify RLS policies were created from schema.sql
2. Check that auth.uid() matches user.id
3. Review Supabase logs

### Build Failures on Vercel

**Problem**: "Module not found" or TypeScript errors
**Solution**:
1. Run `npm install` locally
2. Ensure all imports use correct paths
3. Check `tsconfig.json` settings
4. Clear Vercel cache and redeploy

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use Row Level Security** - Already configured in schema
3. **Validate inputs** - Zod validation is implemented
4. **Rate limiting** - Consider adding for production
5. **HTTPS only** - Vercel provides this automatically

---

## 📈 Scaling Considerations

### Database Performance
- Indexes are already created in schema
- Consider connection pooling for high traffic
- Monitor query performance in Supabase

### File Storage (Future)
- Use Supabase Storage for user uploads (degrees, certificates)
- Configure proper access policies
- Optimize images before upload

### Caching
- Implement Redis for session data (if needed)
- Use Vercel Edge Config for feature flags
- Cache course data to reduce DB queries

---

## 🎯 Next Steps

After successful deployment, consider implementing:

1. **Session Booking Flow**
   - Book sessions with verified teachers
   - Credit deduction logic
   - Calendar integration

2. **Real-time Features**
   - Live notifications
   - Session status updates
   - Chat between teacher/learner

3. **Admin Dashboard**
   - Approve/reject teacher verifications
   - Manage users and courses
   - View analytics

4. **Payment Integration**
   - Subscription system ($5/month unlimited)
   - Credit purchase system
   - Stripe integration

5. **Enhanced Features**
   - Video call integration (Zoom, Google Meet)
   - Rating and review system
   - Skill marketplace
   - Community forum

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs
3. Check Vercel function logs
4. Review browser console errors

---

## 🎉 Congratulations!

Your XSkill application is now live! Users can:
- Sign up and create accounts
- Switch between learner, teacher, and swapper roles
- Apply for teacher verification
- Browse courses and skills
- View their dashboard with XScore and credits
- Manage their profile and sessions

**Production URL**: Replace with your actual Vercel URL
**Database**: Managed by Supabase
**Authentication**: Email/Password + Google OAuth
**Email**: Handled by Resend/Nodemailer

---

## 📝 License

This project is built for educational purposes. Customize as needed for your use case.
