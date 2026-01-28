import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Paste your real link from Neon between the quotes below
    url: "postgresql://alex:password@ep-cool-dark-123.aws.neon.tech/neondb?sslmode=require",
  },
});