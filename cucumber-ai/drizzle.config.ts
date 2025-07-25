import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path: '.env',
});

export default defineConfig({
  schema: './src/lib/chatbot/db/schema.ts',
  out: './src/lib/chatbot/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: process.env.POSTGRES_URL!,
  },
});
