import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getCategoryBySlug, getCategoryPosts } from "../lib/categories";
import { PostCard } from "../components/PostCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function CategoryPosts() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCategoryBySlug(slug), getCategoryPosts(slug)]).then(
      ([cat, posts]) => {
        if (!cancelled) {
          setCategory(cat);
          setPosts(posts);
          setLoading(false);
        }
      }
    );
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!category) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link to="/" className="text-primary hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
        ← Back
      </Link>
      <h1 className="text-4xl font-bold mt-4">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mt-2">{category.description}</p>
      )}
      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-8">No posts in this category.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}