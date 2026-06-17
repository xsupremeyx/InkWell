import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <h1 className="text-9xl font-serif font-black text-border mb-4">404</h1>
      <h2 className="text-4xl font-serif font-bold text-text-primary mb-6">Page not found</h2>
      <p className="text-xl text-text-secondary mb-10 max-w-md">
        The page you are looking for has wandered off into the margins.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-8 py-3 bg-text-primary text-surface rounded-full font-semibold hover:bg-accent transition-colors"
      >
        <span aria-hidden="true">&larr;</span> Return Home
      </Link>
    </div>
  );
}