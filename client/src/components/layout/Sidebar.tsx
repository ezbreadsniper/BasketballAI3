import { useLocation, Link } from "wouter";
import UserProfile from "./UserProfile";
import { 
  Home, 
  User, 
  Layers, 
  Users, 
  HelpCircle, 
  LineChart, 
  Calendar 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  // Navigation items
  const mainNavItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5 mr-3" /> },
    { path: "/profile", label: "My Profile", icon: <User className="h-5 w-5 mr-3" /> },
    { path: "/training-plans", label: "Training Plans", icon: <Layers className="h-5 w-5 mr-3" /> },
    { path: "/team", label: "My Team", icon: <Users className="h-5 w-5 mr-3" /> },
    { path: "/resources", label: "Resources", icon: <HelpCircle className="h-5 w-5 mr-3" /> },
  ];

  const performanceNavItems = [
    { path: "/analytics", label: "Analytics", icon: <LineChart className="h-5 w-5 mr-3" /> },
    { path: "/progress", label: "Progress Tracking", icon: <Calendar className="h-5 w-5 mr-3" /> },
  ];

  // Determine active nav item
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside 
      className={`bg-white border-r border-neutral-200 w-full md:w-64 md:flex md:flex-col md:min-h-screen ${
        isOpen ? 'fixed inset-0 z-50' : 'hidden md:block'
      } transition-all duration-300`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">H</div>
            <span className="font-bold text-xl ml-3">HoopAI</span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-neutral-500 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* User Profile */}
        <UserProfile />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 pb-4">
        <div className="mb-2 ml-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Main</span>
        </div>
        
        {mainNavItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => onClose()}
            className={`flex items-center px-4 py-3 mb-1 rounded-lg font-medium ${
              isActive(item.path)
                ? 'text-primary bg-primary bg-opacity-10'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <div className="mb-2 mt-6 ml-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Performance</span>
        </div>
        
        {performanceNavItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => onClose()}
            className={`flex items-center px-4 py-3 mb-1 rounded-lg font-medium ${
              isActive(item.path)
                ? 'text-primary bg-primary bg-opacity-10'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
