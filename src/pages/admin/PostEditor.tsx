import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getCurrentUser } from "../../lib/auth";
import {
  getPostById,
  getPostPostTags,
  createPost,
  updatePost,
  deletePost,
  setPostTags,
  getAllTagsForAdmin,
  getAllCategoriesForAdmin,
} from "../../lib/admin-posts";
import { toast } from "../../components/Toast";
import { RichTextEditor } from "../../components/RichTextEditor";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { db } from "../../lib/db";

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("draft");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previousStatus, setPreviousStatus] = useState("draft");
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    Promise.all([getAllTagsForAdmin(), getAllCategoriesForAdmin()]).then(
      ([tagsData, categoriesData]) => {
        setTags(tagsData);
        setCategories(categoriesData);
        if (isNew) setLoading(false);
      }
    );

    if (!isNew) {
      Promise.all([getPostById(id), getPostPostTags(id)]).then(([post, tagIds]) => {
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setBody(post.body);
          setExcerpt(post.excerpt || "");
          setCategoryId(post.category_id || "");
          setStatus(post.status);
          setPreviousStatus(post.status);
          setSelectedTags(tagIds);
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (isNew || !slug) {
      const baseSlug = generateSlug(newTitle);
      const timestamp = Date.now().toString(36);
      setSlug(baseSlug + "-" + timestamp);
    }
  }

  async function handleSave() {
    const user = getCurrentUser();
    if (!user) {
      alert("Not logged in");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const result = await createPost(
          title,
          slug,
          body,
          excerpt,
          user.id,
          categoryId || null,
          status
        );
        if (selectedTags.length > 0) {
          await setPostTags(result.id, selectedTags);
        }
        const newStatus = status === "published" ? "published" : "saved as draft";
        toast(`Post ${newStatus} successfully!`);
        navigate(`/admin/posts/${result.id}`);
      } else {
        await updatePost(
          id,
          title,
          slug,
          body,
          excerpt,
          categoryId || null,
          status,
          previousStatus
        );
        await setPostTags(id, selectedTags);
        setPreviousStatus(status);
        const saveStatus = status === "published" ? "published" : "saved as draft";
        toast(`Changes ${saveStatus} successfully!`);
      }
    } catch (err) {
      console.error("Save error:", err);
      toast(err instanceof Error ? err.message : "Error saving post", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    console.log("Deleting post with id:", id);
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(id!);
      console.log("Post deleted successfully");
      toast("Post deleted!");
      navigate("/admin/posts");
    } catch (err) {
      console.error("Delete error:", err);
      toast(err instanceof Error ? err.message : "Error deleting post", "error");
    }
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) return;
    const slug = newCategory.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const catId = crypto.randomUUID();
    try {
      await db.execute({
        sql: "INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)",
        args: [catId, newCategory, slug],
      });
      setCategoryId(catId);
      setCategories((prev) => [...prev, { id: catId, name: newCategory, slug }]);
      setNewCategory("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating category");
    }
  }

  async function handleCreateTag() {
    if (!newTag.trim()) return;
    const slug = newTag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const tagId = crypto.randomUUID();
    try {
      await db.execute({
        sql: "INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)",
        args: [tagId, newTag, slug],
      });
      setSelectedTags((prev) => [...prev, tagId]);
      setTags((prev) => [...prev, { id: tagId, name: newTag, slug }]);
      setNewTag("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating tag");
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{isNew ? "Create New Post" : "Edit Post"}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="form-input"
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="form-input"
                placeholder="post-url-slug"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Short description for previews..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder="Write your post content here..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <button
              onClick={handleSave}
              disabled={saving || !title || !slug || !body}
              className="btn btn-primary w-full"
            >
              {saving ? "Saving..." : isNew ? "Publish Post" : "Save Changes"}
            </button>
            <Link to="/admin/posts" className="btn btn-outline w-full text-center">
              Cancel
            </Link>
            {!isNew && (
              <button
                onClick={handleDelete}
                className="btn btn-outline w-full text-destructive hover:bg-destructive/10"
              >
                Delete Post
              </button>
            )}
          </div>

          <div className="card p-6 space-y-4">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-select"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={!newCategory.trim()}
                  className="btn btn-outline whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.length === 0 ? (
                  <span className="text-sm text-muted-foreground">No tags yet</span>
                ) : (
                  tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`badge ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-primary-foreground"
                          : "badge-default"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag"
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={!newTag.trim()}
                  className="btn btn-outline whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}