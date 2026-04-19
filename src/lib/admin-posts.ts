import { db } from "./db";

export async function getAllPostsForAdmin() {
  const result = await db.execute({
    sql: `SELECT p.*, u.username as author_username, u.full_name as author_name, c.name as category_name
          FROM posts p
          LEFT JOIN users u ON p.author_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.updated_at DESC`,
  });
  return result.rows;
}

export async function getPostById(id: string) {
  const result = await db.execute({
    sql: `SELECT * FROM posts WHERE id = ?`,
    args: [id],
  });
  return result.rows[0] || null;
}

export async function getPostPostTags(postId: string) {
  const result = await db.execute({
    sql: `SELECT tag_id FROM post_tags WHERE post_id = ?`,
    args: [postId],
  });
  return result.rows.map((r) => r.tag_id);
}

export async function createPost(
  title: string,
  slug: string,
  body: string,
  excerpt: string,
  authorId: string,
  categoryId: string | null | undefined,
  status: string
) {
  const postId = crypto.randomUUID();
  const publishedAt = status === "published" ? new Date().toISOString() : null;
  const catId = categoryId || null;

  await db.execute({
    sql: `INSERT INTO posts (id, title, slug, body, excerpt, author_id, category_id, status, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [postId, title, slug, body, excerpt, authorId, catId, status, publishedAt],
  });

  return { id: postId };
}

export async function updatePost(
  id: string,
  title: string,
  slug: string,
  body: string,
  excerpt: string,
  categoryId: string | null,
  status: string,
  previousStatus: string
) {
  const publishedAt =
    status === "published" && previousStatus !== "published"
      ? new Date().toISOString()
      : status === "published"
      ? new Date().toISOString()
      : null;

  await db.execute({
    sql: `UPDATE posts SET title = ?, slug = ?, body = ?, excerpt = ?, category_id = ?, status = ?, published_at = ?, updated_at = datetime('now')
          WHERE id = ?`,
    args: [title, slug, body, excerpt, categoryId, status, publishedAt, id],
  });
}

export async function deletePost(id: string) {
  console.log("deletePost called with id:", id);
  // Delete related records first due to foreign keys
  await db.execute({ sql: `DELETE FROM post_tags WHERE post_id = ?`, args: [id] });
  await db.execute({ sql: `DELETE FROM post_likes WHERE post_id = ?`, args: [id] });
  await db.execute({ sql: `DELETE FROM post_views WHERE post_id = ?`, args: [id] });
  await db.execute({ sql: `DELETE FROM comments WHERE post_id = ?`, args: [id] });
  
  const result = await db.execute({
    sql: `DELETE FROM posts WHERE id = ?`,
    args: [id],
  });
  console.log("Delete result, rows affected:", result.rowsAffected);
}

export async function setPostTags(postId: string, tagIds: string[]) {
  await db.execute({
    sql: `DELETE FROM post_tags WHERE post_id = ?`,
    args: [postId],
  });

  const validTagIds = tagIds.filter((id) => id && id.trim());
  for (const tagId of validTagIds) {
    await db.execute({
      sql: `INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`,
      args: [postId, tagId],
    });
  }
}

export async function getAllTagsForAdmin() {
  const result = await db.execute({
    sql: `SELECT * FROM tags ORDER BY name`,
  });
  return result.rows;
}

export async function getAllCategoriesForAdmin() {
  const result = await db.execute({
    sql: `SELECT * FROM categories ORDER BY name`,
  });
  return result.rows;
}

export async function createCategory(name: string) {
  const id = crypto.randomUUID();
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  await db.execute({
    sql: `INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)`,
    args: [id, name, slug],
  });
  return { id, name, slug };
}

export async function deleteCategory(id: string) {
  await db.execute({ sql: `DELETE FROM categories WHERE id = ?`, args: [id] });
}