import { db } from "./db";

const USER_KEY = "beyondtheshelf_user";

export async function login(email: string, password: string) {
  const result = await db.execute({
    sql: `SELECT * FROM users WHERE email = ?`,
    args: [email],
  });

  const user = result.rows[0];
  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.id) {
    throw new Error("Account not properly set up. Please contact admin.");
  }

  const passwordMatch = await verifyPassword(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const sessionUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

export async function register(
  email: string,
  password: string,
  username: string,
  fullName?: string
) {
  const passwordHash = await hashPassword(password);

  const result = await db.execute({
    sql: `INSERT INTO users (email, password_hash, username, full_name) VALUES (?, ?, ?, ?)`,
    args: [email, passwordHash, username, fullName || null],
  });

  return login(email, password);
}

export function getCurrentUser() {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    const user = JSON.parse(stored);
    if (!user.id) return null;
    return user;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}