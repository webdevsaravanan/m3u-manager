# 🎬 M3U Manager — OTT Navigator Playlist Manager

Angular app hosted on **GitHub Pages** that manages your `movies.m3u` playlist stored in a **GitHub Gist**.

---

## ✅ Features

- Add movies (title, cover image, stream URL)
- Delete movies
- Live poster preview
- One-click copy of M3U URL for OTT Navigator
- Auto-updates Gist on every change

---

## 🚀 Setup Guide (Step by Step)

### STEP 1 — Create a GitHub Gist

1. Go to https://gist.github.com
2. Filename: `movies.m3u`
3. Content:
   ```
   #EXTM3U
   ```
4. Click **Create secret gist**
5. Copy the **Gist ID** from the URL:
   `https://gist.github.com/YOUR_USERNAME/GIST_ID_HERE`

---

### STEP 2 — Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Name: `M3U Manager`
4. Expiration: No expiration (or 1 year)
5. Scope: ✅ **gist** only
6. Click **Generate token**
7. Copy the token (starts with `ghp_...`)

---

### STEP 3 — Fill in Your Credentials

Open `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  githubToken: 'ghp_your_token_here',
  gistId: 'abc123def456...',
  githubUsername: 'your_github_username',
};
```

Do the same in `src/environments/environment.prod.ts`.

---

### STEP 4 — Install & Run Locally

```bash
npm install
npm start
```

Open http://localhost:4200

---

### STEP 5 — Deploy to GitHub Pages

#### First time setup:

1. Create a GitHub repo named `m3u-manager`
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/m3u-manager.git
   git push -u origin main
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

This builds the app and pushes to the `gh-pages` branch automatically.

#### Enable GitHub Pages:
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** → **/ (root)**
4. Save

Your app will be live at:
`https://YOUR_USERNAME.github.io/m3u-manager/`

#### Future deployments:
```bash
npm run deploy
```

---

### STEP 6 — Add to OTT Navigator

1. Open OTT Navigator app
2. Go to **Settings** → **Playlist** → **Add Playlist**
3. Paste your raw Gist URL (shown in the app's URL bar):
   ```
   https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/movies.m3u
   ```
4. Done! Movies appear under **Media → Movies**

---

## 📁 Project Structure

```
m3u-manager/
├── src/
│   ├── app/
│   │   ├── models/movie.model.ts       ← Movie interface
│   │   ├── services/gist.service.ts    ← GitHub Gist API
│   │   ├── app.component.ts            ← Main logic
│   │   ├── app.component.html          ← UI template
│   │   └── app.component.scss          ← Dark cinema styles
│   ├── environments/
│   │   ├── environment.ts              ← Dev credentials
│   │   └── environment.prod.ts         ← Prod credentials
│   ├── assets/no-poster.svg            ← Fallback image
│   ├── index.html
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

---

## ⚠️ Security Note

Your GitHub token will be visible in the built JS files since this is a client-side app.
To minimize risk:
- Use a token with **gist scope only** — it cannot access repos or account settings
- Anyone with the token can only read/write your Gists
- This is acceptable for personal use

---

## 🔄 Re-deploy After Changes

```bash
npm run deploy
```
