import { db } from "./db";

export async function getPublishedPosts(limit = 10, offset = 0) {
  const result = await db.execute({
    sql: `SELECT p.*, u.username as author_username, u.full_name as author_name, c.name as category_name, c.slug as category_slug
          FROM posts p
          LEFT JOIN users u ON p.author_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.status = 'published'
          ORDER BY p.published_at DESC
          LIMIT ? OFFSET ?`,
    args: [String(limit), String(offset)],
  });
  return result.rows;
}

export async function getPostBySlug(slug: string) {
  const result = await db.execute({
    sql: `SELECT p.*, u.username as author_username, u.full_name as author_name, u.avatar_url as author_avatar, c.name as category_name, c.slug as category_slug
          FROM posts p
          LEFT JOIN users u ON p.author_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.slug = ?`,
    args: [slug],
  });
  return result.rows[0] || null;
}

export async function getPostTags(postId: string) {
  const result = await db.execute({
    sql: `SELECT t.* FROM tags t
          JOIN post_tags pt ON t.id = pt.tag_id
          WHERE pt.post_id = ?`,
    args: [postId],
  });
  return result.rows;
}

export async function getRecentPosts(limit = 5) {
  const result = await db.execute({
    sql: `SELECT p.id, p.title, p.slug, p.excerpt, p.featured_image, p.published_at, u.full_name as author_name
          FROM posts p
          LEFT JOIN users u ON p.author_id = u.id
          WHERE p.status = 'published'
          ORDER BY p.published_at DESC
          LIMIT ?`,
    args: [String(limit)],
  });
  return result.rows;
}