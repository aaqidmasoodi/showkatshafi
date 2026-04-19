import { db } from "./db";

export async function getAllCategories() {
  const result = await db.execute({
    sql: `SELECT c.*, COUNT(p.id) as post_count
          FROM categories c
          LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
          GROUP BY c.id
          ORDER BY c.name`,
  });
  return result.rows;
}

export async function getCategoryBySlug(slug: string) {
  const result = await db.execute({
    sql: `SELECT * FROM categories WHERE slug = ?`,
    args: [slug],
  });
  return result.rows[0] || null;
}

export async function getCategoryPosts(slug: string, limit = 20, offset = 0) {
  const result = await db.execute({
    sql: `SELECT p.*, u.full_name as author_name, c.name as category_name, c.slug as category_slug
          FROM posts p
          LEFT JOIN users u ON p.author_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.slug = ? AND p.status = 'published'
          ORDER BY p.published_at DESC
          LIMIT ? OFFSET ?`,
    args: [slug, String(limit), String(offset)],
  });
  return result.rows;
}