# 🚀 Deployment Guide: Projecxy v1.1.0

This guide provides step-by-step instructions to get the Projecxy platform live.

---

## 🏗️ 1. Supabase Setup (Backend)

1. **Create Project**: Sign in to [Supabase](https://supabase.com) and create a new project.
2. **Database Schema**: 
   - Go to the **SQL Editor** in the side navbar.
   - Click **New Query**.
   - Copy-paste the content of `docs/schema.sql` into the editor.
   - Click **Run**.
3. **Storage Setup**:
   - Go to **Storage** and create a new bucket named **`avatars`**.
   - Set the bucket to **Public**.
   - Add a Storage Policy to allow authenticated users to upload to any folder.
4. **Environment Keys**:
   - Go to **Project Settings** -> **API**.
   - Copy the **Project URL** and **`anon` public key**.

---

## ⚙️ 2. Frontend Configuration

1. **Local Setup**:
   - Rename `.env.example` to `.env`.
   - Paste your **VITE_SUPABASE_URL** and **VITE_SUPABASE_ANON_KEY**.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## ☁️ 3. Deployment (Vercel)

1. **GitHub Sync**: Push your code to a new repository on GitHub.
2. **Vercel Connect**: 
   - New Project -> Import your GitHub repo.
3. **Framework**: Choose **Vite**.
4. **Build Settings**: Default settings are okay (`npm run build`, `dist`).
5. **Environment Variables**:
   - Add **VITE_SUPABASE_URL**.
   - Add **VITE_SUPABASE_ANON_KEY**.
6. **Deploy**: Click **Deploy**.

---

## 🛡️ 4. Security Check (Pre-Launch)

- [ ] Row Level Security (RLS) is enabled for all tables in `schema.sql`.
- [ ] No hardcoded keys in the codebase.
- [ ] Storage bucket 'avatars' is restricted to authenticated uploads.
- [ ] `.env` is in `.gitignore`.

---

**Built with ❤️ for Innovation Governance.**
