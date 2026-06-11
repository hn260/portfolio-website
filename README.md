# 💻 GitHub Live-Sync Developer Portfolio

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Style](https://img.shields.io/badge/Styling-Vanilla%20CSS-ff69b4)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![GitHub API](https://img.shields.io/badge/GitHub%20API-v3-black?logo=github)](https://docs.github.com/en/rest)

A premium, highly interactive developer portfolio website that synchronizes dynamically with your GitHub profile in real-time. Whenever you create a new repository or push changes to GitHub, the portfolio reflects the updates instantly without requiring server-side rebuilds or hosting fees.

---

## ✨ Design & Visual Aesthetics

Built with a state-of-the-art developer dashboard aesthetic, the user interface features:
- **Glassmorphism Layouts**: Dynamic backdrop blurs, glowing borders, and translucent dark containers.
- **Multiple Visual Themes**:
  - **Dark Space (Default)**: Deep slate backgrounds with neon cyan and indigo accents.
  - **Neon Cyberpunk**: High-vibrancy hot pinks, neon cyans, and deep violet ambient overlays.
  - **Solarized Light**: Clean, warm paper layout with teal, blue, and forest green accents.
- **Ambient Depth & Motion**: Animated drifting background glow blobs and custom mouse-trailing particle glows.
- **Micro-Animations**: Hover card offsets, spin transitions, and placeholder skeleton loading frames.

---

## 🚀 Key Features

### 1. Real-Time Syncing & Cache Guard
The application queries GitHub's REST API directly from the client. To respect GitHub's unauthenticated API rate limits (60 requests/hour), it implements an intelligent `localStorage` cache:
- **Profile & Repository Data**: Cached for **10 minutes**.
- **Project README Files**: Cached for **1 hour**.
Manual overrides are available via the built-in Control Center.

### 2. In-App README Markdown Renderer
Instead of forcing visitors to navigate away from your portfolio, clicking "README" on any project card opens a custom modal. The app fetches the raw README content, decodes its base64 encoding, compiles the markdown using `marked.js`, and renders it natively styled to match your active visual theme.

### 3. Developer Metrics Dashboard
Aggregates and displays portfolio-wide statistics from your active repositories:
- **Language Distributions**: Color-coded progress bars showing your top 5 programming languages.
- **Aggregated Counters**: Total repository stars, forks, and average repository size.
- **Project Spotlight**: Spotlight cards highlighting your "Most Starred" and "Recently Updated" repositories.

### 4. Interactive Site Control Center
A collapsible configuration drawer on the page allows you to:
- Test the portfolio with different GitHub Usernames in real-time.
- Save a **GitHub Personal Access Token** locally. This bypasses public rate limits (increasing your quota to 5,000 requests/hour) and allows you to fetch/display private repositories.
- Toggle visual themes and hide/show page sections (Metrics Dashboard, Contact Form).

### 5. Local Message Inbox
A glassmorphic contact form that compiles visitor messages, runs transmission animations, and logs them to a mock inbox in `localStorage` for visual testing.

---

## 📁 Project Structure

```
github-portfolio-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for Page builds
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── ContactForm.jsx     # Message form with local logging
│   │   ├── ControlPanel.jsx    # Config drawer (Username, Token, Themes)
│   │   ├── CustomCursor.jsx    # Glow trail following mouse pointer
│   │   ├── Header.jsx          # Profile details & social links
│   │   ├── ProjectCard.jsx     # Individual repo display card
│   │   ├── ProjectGrid.jsx     # Grid with searching, sorting, & filters
│   │   ├── ProjectModal.jsx    # README MD fetch & compilation modal
│   │   └── StatsDashboard.jsx  # Languages & stars analytics panel
│   ├── utils/
│   │   └── githubApi.js        # GitHub REST API client & cache logic
│   ├── App.jsx                 # App root & state coordinator
│   ├── index.css               # Design tokens, variables, & animations
│   └── main.jsx                # DOM mounting entrypoint
├── index.html                  # Shell HTML template with SEO tags
├── package.json                # Project dependencies & configurations
├── vercel.json                 # Routing rewrites for Vercel deployment
└── vite.config.js              # Vite compiler configuration
```

---

## 🛠️ Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Setup Instructions
1. Clone or navigate to the repository directory:
   ```bash
   cd github-portfolio-website
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the developer server:
   ```bash
   npm run dev
   ```
4. Open your browser to the address printed in the terminal (usually `http://localhost:5173`).

---

## 🌐 Deploying the Site

This application is built to compile into a static bundle. It can be hosted on any static provider for free.

### Deployment Option A: GitHub Pages (Via GitHub Actions)
We have included a pre-configured workflow file in `.github/workflows/deploy.yml`. When you push to the `main` branch, it automatically builds and deploys your site.

1. Create a public repository on [github.com](https://github.com).
2. Push your local directory to the repository:
   ```bash
   git init
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git add .
   git commit -m "feat: initial commit"
   git push -u origin main
   ```
3. Open your repository on GitHub and click **Settings** (top tab).
4. Select **Pages** from the left sidebar.
5. Under **Build and deployment** -> **Source**, select **GitHub Actions** from the dropdown menu.
6. The deployment will deploy to: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

### Deployment Option B: Vercel (Auto-Sync)
1. Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New** -> **Project** on your dashboard.
3. Import your repository and click **Deploy** (Vercel automatically detects the Vite config).
4. Our pre-configured [vercel.json](vercel.json) file will automatically handle SPA URL routing rewrites at Vercel's edge CDN.

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
