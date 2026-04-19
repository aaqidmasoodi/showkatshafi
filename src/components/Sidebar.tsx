import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getAllCategories } from "../lib/categories";

export function Sidebar() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  return (
    <aside className="space-y-8">
      <div className="card p-6">
        <h3 className="font-bold text-lg mb-4">Categories</h3>
        <nav className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
                {cat.post_count > 0 && (
                  <span className="ml-1 text-xs">({cat.post_count})</span>
                )}
              </Link>
            ))
          )}
        </nav>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-lg mb-4">Beyond the Shelf</h3>
        <p className="text-sm text-muted-foreground mb-4">
          A blog by Showkat Shafi - poet, author, and theatre enthusiast.
        </p>
        <Link
          to="/about"
          className="text-sm text-primary hover:underline"
        >
          More about →
        </Link>
      </div>
    </aside>
  );
}