# Global Trade Intelligence Dashboard

A single-page interactive dashboard that visualizes country-level trade data on a world map.

## Features
- Choropleth world map with selectable metric (exports/imports/balance/turnover)
- Country click-through interaction from map
- Top 10 import/export category breakdown charts
- Country KPI summary cards
- Top 10 global trade leaders table
- Year switcher (2021-2024 simulated panel)

## Run locally
1. Download/clone the repository.
2. Open `index.html` in your browser.

## Do this now (quick path)
1. Open your repository on GitHub.
2. Click **Settings** → **Pages**.
3. In **Build and deployment**, set **Source** to **GitHub Actions** and save.
4. Click **Actions** tab → open **Deploy static dashboard to GitHub Pages**.
5. Click **Run workflow** (branch: `main`).
6. Wait for green check ✅.
7. Open: `https://<your-username>.github.io/<your-repo-name>/`.

## Publish to GitHub Pages (full step-by-step)
Follow these steps exactly in order.

### 1) Create a GitHub repository
1. Go to https://github.com/new
2. Create a repository (example: `global-trade-dashboard`).

### 2) Push this project to that repository
Run these commands from your project folder:

```bash
git init
git add .
git commit -m "Initial dashboard commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

> If this project is already a git repo, skip `git init` and just push to `main`.

### 3) Enable GitHub Pages from Actions
1. Open your repo on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment** choose **Source: GitHub Actions**.

### 4) Trigger deployment
You can do either of these:
1. Push a new commit to `main`.
2. Or go to **Actions** → **Deploy static dashboard to GitHub Pages** → **Run workflow**.

### 5) Open your live interactive webpage
After the workflow turns green, open:

```text
https://<your-username>.github.io/<your-repo-name>/
```

## Deployment files in this repo
- `.github/workflows/deploy-pages.yml` (deployment automation)
- `.nojekyll` (ensures static files are served as-is)

## If you are on the "My contributions" page (like your screenshot)
1. Click the green **New repository** button (top-right).
2. Repository name: use `Codex-tryout-` (or any name you want).
3. Keep it **Public** (recommended for free GitHub Pages).
4. Click **Create repository**.
5. After it opens, go to **Settings → Pages** and continue the steps above.
