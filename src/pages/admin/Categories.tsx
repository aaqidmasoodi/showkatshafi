import { useState, useEffect } from "react";
import {
  getAllCategoriesForAdmin,
  createCategory,
  deleteCategory,
} from "../../lib/admin-posts";
import { toast } from "../../components/Toast";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getAllCategoriesForAdmin();
    setCategories(data);
    setLoading(false);
  }

  async function handleCreateCategory() {
    if (!newCategory.trim()) return;
    setSaving(true);
    try {
      await createCategory(newCategory.trim());
      setNewCategory("");
      await loadCategories();
      toast("Category created!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error creating category", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
      toast("Category deleted!");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Error deleting category", "error");
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-1">Manage blog categories</p>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="form-input flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
          />
          <button
            onClick={handleCreateCategory}
            disabled={saving || !newCategory.trim()}
            className="btn btn-primary"
          >
            {saving ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-muted-foreground">
                  No categories yet. Create one above.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="font-medium">{category.name}</td>
                  <td className="text-muted-foreground text-sm">{category.slug}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}