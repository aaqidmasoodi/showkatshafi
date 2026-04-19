import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getPublishedPosts } from "../lib/posts";
import { PostCard } from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";

export default function BlogIndex() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts(20)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No posts yet.</p>
              <Link to="/" className="text-primary hover:underline">Go home</Link>
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}