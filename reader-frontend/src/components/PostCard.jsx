import { Link } from 'react-router-dom';

// This component expects to receive a 'post' object via props
export default function PostCard({ post }) {
  // Format the ISO date into something readable (e.g., "Jun 15, 2026")
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="grow">
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-sm text-text-secondary mb-4">
          By <span className="font-medium text-text-primary">{post.author?.username || 'Unknown'}</span> • {formattedDate}
        </p>

        {/* line-clamp-3 automatically truncates the text with "..." if it gets too long! */}
        <p className="text-text-secondary mb-6 line-clamp-3">
          {post.content}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <Link 
          to={`/posts/${post.id}`} 
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm font-medium text-text-primary hover:bg-gray-50 hover:shadow-sm transition-all w-max"
        >
          Read article <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}