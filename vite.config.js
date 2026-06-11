import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dynamic base path determination for GitHub Pages vs Vercel vs Local
let base = '/'
if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
  const repoName = process.env.GITHUB_REPOSITORY.split('/')[1]
  // User page repos (e.g. hn260.github.io) are served from root '/'
  // Project page repos (e.g. github-portfolio-website) are served from '/github-portfolio-website/'
  if (!repoName.endsWith('.github.io')) {
    base = `/${repoName}/`
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: base,
})
