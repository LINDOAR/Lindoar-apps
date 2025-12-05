
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // IMPORTANT: Replace 'bellybites' with the name of your GitHub repository for deployment.
    base: '/bellybites/',
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
