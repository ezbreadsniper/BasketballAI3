import { useState } from "react";
import Sidebar from "./Sidebar";
import UserProfile from "./UserProfile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-900 text-neutral-100">
      {/* Mobile Header */}
      <header className="bg-neutral-800 border-b border-neutral-700 py-3 px-4 flex justify-between items-center md:hidden">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary text-white flex items-center justify-center font-bold text-xs rounded">HoopAI</div>
          <span className="font-bold text-xl ml-2 text-white">HoopAI</span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="text-neutral-300 hover:text-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Top Header (Desktop) */}
      <header className="hidden md:flex bg-neutral-800 border-b border-neutral-700 py-2 px-4 items-center justify-between fixed top-0 right-0 left-0 z-10 h-14">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-primary text-white flex items-center justify-center font-bold text-xs rounded">HoopAI</div>
          <span className="font-bold text-xl ml-2 text-white">HoopAI</span>
        </div>
        <UserProfile />
      </header>

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-900 md:mt-14">
        {children}
      </main>
    </div>
  );
}
