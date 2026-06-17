import { Link } from 'react-router-dom';

export default function AuthorPostCard({ post, onDelete, onTogglePublish }) {
    return (
        <div className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    {post.published ? (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Published</span>
                    ) : (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">Draft</span>
                    )}
                    <span className="text-sm text-text-secondary italic">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-text-primary mb-2 line-clamp-2">
                    {post.title}
                </h3>
            </div>
            
            <div className="border-t border-border px-6 py-4 bg-background/50 rounded-b-xl flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <Link to={`/posts/${post.id}/edit`} className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors">
                        Edit
                    </Link>
                    <Link to={`/posts/${post.id}/comments`} className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
                        Comments
                    </Link>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => onTogglePublish(post)}
                        className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                        onClick={() => onDelete(post.id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}