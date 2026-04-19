import { Link } from "react-router";

export function PostCard({ post }) {
  return (
    <article className="card h-full flex flex-col">
      {post.featured_image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="card-body flex flex-col flex-1">
        {post.category_name && (
          <Link
            to={`/category/${post.category_slug}`}
            className="text-xs font-medium text-primary hover:underline mb-2"
          >
            {post.category_name}
          </Link>
        )}
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link to={`/post/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-4 text-xs text-muted-foreground">
          {post.author_name && <span className="font-medium">{post.author_name}</span>}
          {post.published_at && (
            <>
              <span>·</span>
              <time>{new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
            </>
          )}
        </div>
      </div>
    </article>
  );
}