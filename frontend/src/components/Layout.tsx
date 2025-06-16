import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';  // <-- this is important

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Outlet />  {/* This is where your nested pages will render */}
      </main>
      <Footer />
    </div>
  );
};
