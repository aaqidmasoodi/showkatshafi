import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getPostBySlug, getPostTags } from "../lib/posts";
import { Sidebar } from "../components/Sidebar";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPostBySlug(slug!).then((postData) => {
      setPost(postData);
      if (postData) {
        getPostTags(postData.id).then(setTags);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link to="/" className="text-primary hover:underline">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary mb-6 block">
            ← Back to Blog
          </Link>

          {post.category_name && (
            <Link
              to={`/category/${post.category_slug}`}
              className="inline-block mb-4 text-sm font-medium text-primary hover:underline"
            >
              {post.category_name}
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-8 text-muted-foreground">
            {post.author_name && <span>By <span className="font-medium text-foreground">{post.author_name}</span></span>}
            {post.published_at && (
              <>
                <span>·</span>
                <time>{new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              </>
            )}
          </div>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full max-h-[500px] object-cover rounded-lg mb-12"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
          </div>

          {tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-medium mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/tag/${tag.slug}`}
                    className="badge badge-default hover:bg-muted"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
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