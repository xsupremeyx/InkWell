import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';

import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import Account from './pages/Account';

// Dashboard & Post features (Next Phase!)
import Dashboard from './pages/Dashboard';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import PostComments from './pages/PostComments';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        
        {/* Protected Author Routes */}
        <Route element={<Layout />}>
          <Route element={<AuthGuard><Outlet /></AuthGuard>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="/posts/:id/comments" element={<PostComments />} />
            <Route path="/account" element={<Account />} />
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}