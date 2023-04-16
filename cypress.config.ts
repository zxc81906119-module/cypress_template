import { defineConfig } from 'cypress'
//https://docs.cypress.io/guides/references/configuration
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
})
