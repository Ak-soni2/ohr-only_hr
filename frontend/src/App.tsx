import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { Home } from './pages/Home.tsx';
import { About } from './pages/About.tsx';
import {Events }from './pages/Events.tsx';
import { EventDetail } from './pages/EventDetail.tsx';
import { Activities } from './pages/Activities.tsx';
import { Contact } from './pages/Contact.tsx';
import { Membership } from './pages/Membership.tsx';
import Admin from './pages/Admin.tsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound';
import { Layout } from './components/Layout.tsx';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="activities" element={<Activities />} />
          <Route path="contact" element={<Contact />} />
          <Route path="membership" element={<Membership />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
