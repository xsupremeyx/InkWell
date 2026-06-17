import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text-primary selection:bg-accent/20">
      <Navbar />
      
      {/* The key prop forces React to remount this section every time the URL changes,
          which perfectly triggers our CSS animation! */}
      <main key={location.pathname} className="grow animate-page-enter">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}