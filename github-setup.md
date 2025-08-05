# GitHub Pages Setup Guide

## Step 1: Create GitHub Repository

1. **Go to [github.com](https://github.com)** and sign in (or create an account)
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository name:** `rental-calculator`
5. **Description:** `Interactive rental property investment calculator`
6. **Make it Public** (required for free GitHub Pages)
7. **DO NOT** initialize with README (we already have one)
8. **Click "Create repository"**

## Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/rental-calculator.git
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll down to "Pages"** in the left sidebar
4. **Under "Source"**, select **"Deploy from a branch"**
5. **Branch:** Select `main`
6. **Folder:** Select `/ (root)`
7. **Click "Save"**

## Step 4: Your Site Will Be Live!

Your rental calculator will be available at:
`https://YOUR_USERNAME.github.io/rental-calculator/`

## Next Steps

Once you've created the GitHub repository, run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/rental-calculator.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username! 