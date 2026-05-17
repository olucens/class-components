import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx,js,jsx}',
        'src/**/*.spec.{ts,tsx,js,jsx}',
        'src/main.{ts,tsx,js,jsx}',
        'src/setupTests.{ts,js}',
        'src/**/*.d.ts'
      ],
      lines: 50,
      functions: 50,
      branches: 50,
      statements: 80
    }
  }
})