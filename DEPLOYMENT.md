# SideGuide Deployment Guide

## 🚀 Deploy to Vercel

### 1. Push to GitHub

```bash
# Initialize GitHub repo (if not already done)
git remote add origin https://github.com/YOUR_USERNAME/sideguide.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel

1. Go to https://vercel.com
2. Sign up / Log in
3. Click "Add New..." → "Project"
4. Select your GitHub repo (`sideguide`)
5. Click "Import"

### 3. Configure Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### 4. Set Custom Domain

In Vercel project settings → "Domains":
- Add `sideguide.com` (or your domain)
- Update DNS records as instructed

### 5. Configure OAuth Redirect URL

In Supabase Auth settings, add Vercel deployment URL:

```
https://yourdomain.com/auth/callback
https://sideguide-xyz.vercel.app/auth/callback (for preview)
```

### 6. Deploy

Click "Deploy" and Vercel will automatically build and deploy!

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database schema initialized
- [ ] Google OAuth configured
- [ ] Environment variables set
- [ ] GitHub repo created
- [ ] `.env.local` has correct values (for local testing)
- [ ] `npm run build` passes locally
- [ ] All pages load without errors
- [ ] Share functionality works
- [ ] Print to PDF works

---

## 🔧 Local Testing Before Deployment

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Open http://localhost:3000
```

---

## 🐛 Troubleshooting

### "Supabase connection failed"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is valid
- Check RLS policies are enabled on all tables

### "OAuth redirect failed"
- Verify redirect URL in Supabase matches Vercel domain
- Check Google OAuth credentials are valid
- Clear browser cookies and try again

### "Database operations fail"
- Check user is authenticated
- Verify RLS policies allow the operation
- Check user_id matches in database

---

## 📝 After Deployment

1. Test all features on live site
2. Share with beta users
3. Monitor for errors (Vercel dashboard)
4. Update DNS for custom domain
5. Set up analytics (optional)
6. Create social media links

---

## 🎉 You're Live!

Your SideGuide instance is now live. Share the URL with your community!
