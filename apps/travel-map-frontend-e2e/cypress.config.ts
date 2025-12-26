import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run travel-map-frontend:serve',
        production: 'npx nx run travel-map-frontend:serve-static',
      },
      ciWebServerCommand: 'npx nx run travel-map-frontend:serve-static',
      ciBaseUrl: process.env['NODE_ENV'] === 'production' ? process.env['URL'] : 'http://localhost:4200',
    }),
    baseUrl: process.env['NODE_ENV'] === 'production' ? process.env['URL'] : 'http://localhost:4200',
    env: {
      API_URL:
        process.env['NODE_ENV'] === 'production'
          ? 'https://travel-map-backend-2vuy.onrender.com'
          : 'http://localhost:3000',
    },
  },
});
