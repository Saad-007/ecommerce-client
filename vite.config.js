import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', // ✅ Fix for correct asset paths on Vercel
  plugins: [react(), tailwindcss()],
})
