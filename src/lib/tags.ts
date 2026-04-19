import { db } from "./db";

export async function getAllTags() {
  const result = await db.execute({
    sql: `SELECT t.*, COUNT(pt.post_id) as post_count
          FROM tags t
          LEFT JOIN post_tags pt ON t.id = pt.tag_id
          LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'published'
          GROUP BY t.id
          ORDER BY t.name`,
  });
  return result.rows;
}

export async function getTagBySlug(slug: string) {
  const result = await db.execute({
    sql: `SELECT * FROM tags WHERE slug = ?`,
    args: [slug],
  });
  return result.rows[0] || null;
}

export async function getTagPosts(slug: string, limit = 20, offset = 0) {
  const result = await db.execute({
    sql: `SELECT p.*, u.full_name as author_name, c.name as category_name, c.slug as category_slug
          FROM posts p
          JOIN post_tags pt ON p.id = pt.post_id
          JOIN tags t ON pt.tag_id = t.id
          LEFT JOIN users u ON p.author_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE t.slug = ? AND p.status = 'published'
          ORDER BY p.published_at DESC
          LIMIT ? OFFSET ?`,
    args: [slug, String(limit), String(offset)],
  });
  return result.rows;
}