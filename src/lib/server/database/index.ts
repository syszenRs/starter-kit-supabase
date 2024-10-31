import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import { dev } from '$app/environment';

const client = dev ? postgres(DATABASE_URL) : postgres(DATABASE_URL, { ssl: 'require' });

export const database = drizzle(client, {});
