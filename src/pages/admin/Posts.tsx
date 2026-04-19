import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getAllPostsForAdmin } from "../../lib/admin-posts";

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPostsForAdmin().then(setPosts).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-16 text-muted-foreground">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">All Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog posts</p>
        </div>
        <Link to="/admin/posts/new" className="btn btn-primary">
          + New Post
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No posts yet. <Link to="/admin/posts/new" className="text-primary hover:underline">Create your first post</Link>
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="font-medium">{post.title}</td>
                  <td className="text-muted-foreground">{post.author_name || "-"}</td>
                  <td className="text-muted-foreground">{post.category_name || "-"}</td>
                  <td>
                    <span className={`badge ${
                      post.status === "published"
                        ? "badge-success"
                        : post.status === "draft"
                        ? "badge-warning"
                        : "badge-default"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground text-sm">
                    {new Date(post.updated_at).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <Link to={`/post/${post.slug}`} target="_blank" className="text-primary hover:underline text-sm mr-3">
                      View
                    </Link>
                    <Link to={`/admin/posts/${post.id}`} className="text-primary hover:underline text-sm">
                      Edit
                    </Link>
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