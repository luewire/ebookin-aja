import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

export default defineConfig({
  datasource: {
    // Use DIRECT_URL for CLI commands (migrations, db push)
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },
});
