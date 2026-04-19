import { createClient } from "@libsql/client";

const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY1NDgyMTEsImlkIjoiMDE5ZGEyODYtNTIwMS03YjFiLTk1ODgtOTM1YTJmYWNkZjIwIiwicmlkIjoiZjI1YTNmZGQtNmM0OC00MGE0LTk4YjQtZjM3ZWQ0NWZmNDVmIn0.9FvQaCmahuem22SeBiBYGCOWpx3oRTC-QzNG7TnQV3HfWZEYpBAZe-vJATx1Gl7IgBZAMyE2-AZHGF-PSzBeDQ";
const TURSO_URL = "libsql://showkatshafi-infinitebutdiscrete.aws-eu-west-1.turso.io";

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'author')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    body TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS post_tags (
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
  )`,
  `CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    parent_id TEXT REFERENCES comments(id) ON DELETE CASCADE,
    author_name TEXT,
    author_email TEXT,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS post_likes (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(post_id, user_id),
    UNIQUE(post_id, ip_address)
  )`,
  `CREATE TABLE IF NOT EXISTS post_views (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    ip_address TEXT,
    viewed_at TEXT DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at)`,
  `CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id)`,
  `CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id)`,
  `CREATE INDEX IF NOT EXISTS idx_post_views_post ON post_views(post_id)`,
];

async function init() {
  try {
    for (const stmt of schemaStatements) {
      await db.execute(stmt);
    }
    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

init();