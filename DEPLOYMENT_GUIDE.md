# Deployment Guide: Price of Processing Quiz

This guide will help you create a GitHub repository and deploy to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Git installed
- Node.js 18+ installed

## Step 1: Commit Your Changes

```bash
# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "Add Price of Processing quiz feature"

# If you want to create a new branch for this feature
git checkout -b main
# or
git checkout -b master
```

## Step 2: Create a New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `price-of-processing` (or your preferred name)
3. Description: "Interactive quiz: The Price of Processing - Measuring information asymmetry in DeFi"
4. Choose **Public** (to make it public)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 3: Connect to GitHub

### Option A: Create a New Repository (Recommended)

```bash
# Remove existing remote (if you want a fresh repo)
git remote remove origin

# Add your new repository as remote
git remote add origin https://github.com/YOUR_USERNAME/price-of-processing.git
# Replace YOUR_USERNAME with your GitHub username

# Push to GitHub
git push -u origin main
# or if your default branch is master:
# git push -u origin master
```

### Option B: Use Existing Repository

If you want to keep using the existing repo but push to a new branch:

```bash
# Create and push to a new branch
git checkout -b price-of-processing-quiz
git push -u origin price-of-processing-quiz
```

## Step 4: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your GitHub account and choose the repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `pnpm install` (or `npm install`)
5. Click **Deploy**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? price-of-processing
# - Directory? ./
# - Override settings? No
```

## Step 5: Make Repository Public

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Scroll down to **Danger Zone**
4. Click **Change visibility**
5. Select **Make public**
6. Confirm by typing the repository name

## Step 6: Environment Variables (if needed)

If you have any environment variables:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add any required variables (e.g., API keys)
4. Redeploy if needed

## Step 7: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check Node.js version (should be 18+)
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

### Hot Reload Issue (WSL)

The `dev` script already includes `WATCHPACK_POLLING=true` for WSL compatibility.

### TypeScript Errors

These are usually just resolution issues. The app should still work. If needed:
```bash
pnpm install
# Restart TypeScript server in your IDE
```

## Quick Commands Summary

```bash
# 1. Commit changes
git add .
git commit -m "Add Price of Processing quiz"

# 2. Create new repo on GitHub, then:
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/price-of-processing.git
git push -u origin main

# 3. Deploy to Vercel
# Visit https://vercel.com/new and import your repo
# OR use CLI: vercel
```

## Post-Deployment

- Your app will be live at: `https://your-project-name.vercel.app`
- Vercel automatically deploys on every push to main branch
- Check deployment status in Vercel dashboard

