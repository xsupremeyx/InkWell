import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* This main tag will expand to push the footer to the bottom */}
      <main className="grow max-w-4xl w-full mx-auto px-6 pt-8 pb-12">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
}