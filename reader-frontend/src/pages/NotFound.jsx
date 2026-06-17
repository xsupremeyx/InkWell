import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-serif text-9xl font-black text-accent mb-4">404</h1>
      <h2 className="text-3xl font-bold text-text-primary mb-6">Page not found.</h2>
      <p className="text-lg text-text-secondary max-w-md mx-auto mb-10">
        The page you're looking for doesn't exist, was moved, or you might have mistyped the address.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-full font-medium text-text-primary hover:bg-gray-50 hover:shadow-sm transition-all"
      >
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>
    </div>
  );
}