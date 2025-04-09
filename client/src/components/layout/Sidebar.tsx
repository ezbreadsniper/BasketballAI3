import { useLocation, Link } from "wouter";
import { 
  Home, 
  User, 
  Layers, 
  Users, 
  FileText, 
  BarChart3, 
  TrendingUp,
  Dumbbell,
  Award,
  Target,
  Settings,
  ChevronRight,
  Ruler
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  // Navigation items with Football Manager style structure (hierarchical)
  const navItems = [
    { 
      category: "Overview",
      items: [
        { path: "/", label: "Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      category: "Player Development",
      items: [
        { path: "/profile", label: "Player Profile", icon: <User className="h-4 w-4 mr-2" /> },
        { path: "/player-assessment", label: "Skill Assessment", icon: <Ruler className="h-4 w-4 mr-2" /> },
        { path: "/training-plans", label: "Training Schedule", icon: <Dumbbell className="h-4 w-4 mr-2" /> },
        { path: "/analytics", label: "Performance Data", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
        { path: "/progress", label: "Development Hub", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      category: "Team Management",
      items: [
        { path: "/team", label: "Squad", icon: <Users className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      category: "Resources",
      items: [
        { path: "/resources", label: "Training Videos", icon: <FileText className="h-4 w-4 mr-2" /> },
      ]
    }
  ];

  // Determine active nav item
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside 
      className={`bg-neutral-900 border-r border-neutral-800 w-full md:w-72 md:flex md:flex-col md:min-h-screen ${
        isOpen ? 'fixed inset-0 z-50' : 'hidden md:block'
      } transition-all duration-300 md:mt-14`}
    >
      {/* Mobile Header */}
      <div className="p-3 border-b border-neutral-800 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary text-white flex items-center justify-center font-bold text-xs rounded">HoopAI</div>
            <span className="font-bold text-base ml-2 text-white">HoopAI</span>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((section, idx) => (
          <div key={idx} className="mb-4">
            <div className="px-4 mb-1">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{section.category}</span>
            </div>
            
            {section.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => onClose()}
                className={`flex items-center justify-between px-4 py-2 text-sm ${
                  isActive(item.path)
                    ? 'text-primary bg-neutral-800 border-l-2 border-primary'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-1">{item.label}</span>
                </div>
                <ChevronRight className={`h-3 w-3 ${isActive(item.path) ? 'text-primary' : 'text-neutral-600'}`} />
              </Link>
            ))}
          </div>
        ))}
        
        {/* Bottom section for settings */}
        <div className="px-4 mb-1 mt-8">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">App Settings</span>
        </div>
        
        <Link
          href="/settings"
          onClick={() => onClose()}
          className="flex items-center justify-between px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 border-l-2 border-transparent"
        >
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            <span className="ml-1">Settings</span>
          </div>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
        </Link>
      </nav>
      
      {/* Version info */}
      <div className="px-4 py-2 text-center border-t border-neutral-800">
        <span className="text-xs text-neutral-500">HoopAI v1.0.0</span>
      </div>
    </aside>
  );
}
