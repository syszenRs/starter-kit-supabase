import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schemaFilter: ['public'],
	schema: './src/schemas/database/*',
	dialect: 'postgresql',
	verbose: true,
	strict: true,
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});
