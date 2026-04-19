import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getTagBySlug, getTagPosts } from "../lib/tags";
import { PostCard } from "../components/PostCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function TagPosts() {
  const { slug } = useParams();
  const [tag, setTag] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getTagBySlug(slug), getTagPosts(slug)]).then(([t, posts]) => {
      if (!cancelled) {
        setTag(t);
        setPosts(posts);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!tag) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Tag not found</h1>
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
      <h1 className="text-4xl font-bold mt-4">#{tag.name}</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground mt-8">No posts with this tag.</p>
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