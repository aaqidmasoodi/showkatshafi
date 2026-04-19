import { createClient } from "@libsql/client";

const TURSO_URL = import.meta.env.VITE_TURSO_URL;
const TURSO_TOKEN = import.meta.env.VITE_TURSO_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  throw new Error("Missing Turso environment variables. Check .env file.");
}

export const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});
