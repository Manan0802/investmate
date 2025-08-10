import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// This simplified config correctly relies on postcss.config.cjs to handle Tailwind.
export default defineConfig({
  plugins: [react()],
})
