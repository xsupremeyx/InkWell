import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

  const plainTextExcerpt = stripHtml(post.content);
  return (
    <article className="bg-surface rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-border/50">
      <div className="grow">
        {/* The terracotta left accent bar + serif font! */}
        <div className="border-l-4 border-accent pl-4 mb-4">
          <h3 className="text-2xl font-serif font-bold text-text-primary line-clamp-2">
            {post.title}
          </h3>
        </div>
        
        <p className="text-sm text-text-secondary mb-6 flex items-center gap-2">
          <span className="font-medium text-text-primary">{post.author?.username || 'Unknown'}</span> 
          <span className="text-[10px]">●</span> 
          <span className="italic">{formattedDate}</span>
        </p>

        <p className="text-text-secondary mb-8 line-clamp-3 leading-relaxed">
          {plainTextExcerpt.length > 200 ? plainTextExcerpt.slice(0, 200) + '...' : plainTextExcerpt}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-border/50">
        {/* Clean, editorial inline link instead of a chunky button */}
        <Link 
          to={`/posts/${post.id}`} 
          className="group inline-flex items-center gap-2 text-sm font-bold text-text-primary hover:text-accent transition-colors"
        >
          Read article 
          <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}