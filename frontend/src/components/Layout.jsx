import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

import Navbar from './Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <style jsx>{`
        .bg-navy-50 { background-color: #e8edf5; }
        .bg-navy-100 { background-color: #d0d9eb; }
        .bg-navy-700 { background-color: #1e3a5f; }
        .bg-navy-800 { background-color: #0f2b4d; }
        .text-navy-300 { color: #a0b4d0; }
        .text-navy-400 { color: #7a95b5; }
        .text-navy-500 { color: #5a7a9a; }
        .text-navy-800 { color: #0f2b4d; }
        .border-navy-600 { border-color: #2a4a6e; }
        .border-navy-700 { border-color: #1e3a5f; }
        .hover\\:bg-navy-700:hover { background-color: #1e3a5f; }
      `}</style>
    </div>
  );
};

export default Layout;