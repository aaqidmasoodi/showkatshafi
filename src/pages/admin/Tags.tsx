import { useState, useEffect } from "react";
import { getAllTagsForAdmin, createTag, deleteTag } from "../../lib/admin-posts";
import { toast } from "../../components/Toast";

export default function AdminTags() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    const data = await getAllTagsForAdmin();
    console.log("Tags from DB:", JSON.stringify(data, null, 2));
    setTags(data);
    setLoading(false);
  }

  async function handleCreateTag() {
    if (!newTag.trim()) return;
    setSaving(true);
    try {
      await createTag(newTag.trim());
      setNewTag("");
      await loadTags();
      toast("Tag created!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error creating tag", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      console.log("Deleting tag with id:", id);
      await deleteTag(id);
      console.log("Delete done, reloading tags");
      await loadTags();
      console.log("Tags reloaded");
      toast("Tag deleted!");
    } catch (err) {
      console.error("Delete tag error:", err);
      toast(err instanceof Error ? err.message : "Error deleting tag", "error");
    }
  }

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-16 text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tags</h1>
        <p className="text-muted-foreground mt-1">Manage blog tags</p>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag name"
            className="form-input flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
          />
          <button
            onClick={handleCreateTag}
            disabled={saving || !newTag.trim()}
            className="btn btn-primary"
          >
            {saving ? "Adding..." : "Add Tag"}
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="form-input"
          />
        </div>

        {filteredTags.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {search ? "No tags found." : "No tags yet. Create one above."}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => {
              console.log("Rendering tag:", tag, "id type:", typeof tag.id, "id value:", tag.id);
              return (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-sm"
                >
                  {tag.name}
                  <button
                    onClick={() => {
                      console.log("Click delete, tag.id:", tag.id);
                      handleDelete(tag.id);
                    }}
                    className="p-0.5 hover:bg-muted rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}