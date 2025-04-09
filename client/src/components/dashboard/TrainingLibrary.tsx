import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Play, ChevronRight, Video, ArrowUpRight } from "lucide-react";

interface TrainingResource {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnailUrl: string;
}

export default function TrainingLibrary() {
  const { data: resources, isLoading } = useQuery<TrainingResource[]>({
    queryKey: ['/api/training/resources'],
  });

  if (isLoading) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
        <div className="border-b border-neutral-700 px-3 py-2">
          <Skeleton className="h-5 w-40 bg-neutral-700" />
        </div>
        <div className="p-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-750 border border-neutral-700 rounded-sm">
              <Skeleton className="h-24 w-full bg-neutral-700" />
              <div className="p-2">
                <Skeleton className="h-3.5 w-32 mb-2 bg-neutral-700" />
                <Skeleton className="h-3 w-full mb-2 bg-neutral-700" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-16 bg-neutral-700" />
                  <Skeleton className="h-3 w-16 bg-neutral-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default resources if API returns nothing
  const defaultResources: TrainingResource[] = [
    {
      id: 1,
      title: "Free Throw Form Breakdown",
      description: "Pro coach analysis of proper free throw mechanics and consistent shooting form.",
      duration: "8 minutes",
      category: "Shooting",
      thumbnailUrl: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      title: "Advanced Dribbling Series",
      description: "Five-part training series focused on weak hand development and combo moves.",
      duration: "25 minutes",
      category: "Ball Handling",
      thumbnailUrl: "https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      title: "Vertical Jump Training",
      description: "Progressive plyometric program to increase explosive power and vertical leap.",
      duration: "18 minutes",
      category: "Athletic Training",
      thumbnailUrl: "https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const displayResources = resources || defaultResources;
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shooting':
        return 'border-blue-500 text-blue-400';
      case 'ball handling':
        return 'border-yellow-500 text-yellow-400';
      case 'athletic training':
        return 'border-green-500 text-green-400';
      default:
        return 'border-neutral-500 text-neutral-400';
    }
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-sm h-full">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <div className="flex items-center">
          <Video className="h-3.5 w-3.5 text-neutral-400 mr-2" />
          <h2 className="text-xs font-semibold text-neutral-100 uppercase">Training Resources</h2>
        </div>
        <a href="/resources" className="flex items-center text-xs text-primary hover:text-primary/80">
          View Library
          <ChevronRight className="h-3 w-3 ml-1" />
        </a>
      </div>
      
      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {displayResources.map((resource) => (
          <div 
            key={resource.id} 
            className="bg-neutral-750 border border-neutral-700 rounded-sm overflow-hidden hover:border-neutral-600 transition-colors"
          >
            <div className="relative group">
              <img 
                src={resource.thumbnailUrl} 
                alt={resource.title} 
                className="h-24 w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <Play className="h-4 w-4 text-white ml-0.5" />
                </button>
              </div>
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black bg-opacity-75 rounded text-[10px] text-white flex items-center">
                <Clock className="h-2.5 w-2.5 mr-1" />
                {resource.duration}
              </div>
            </div>
            <div className="p-2">
              <h3 className="text-xs font-medium text-neutral-100 mb-1 truncate">{resource.title}</h3>
              <p className="text-[10px] text-neutral-400 mb-1.5 line-clamp-2">{resource.description}</p>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-medium border-l-2 pl-1.5 ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                <button className="text-[10px] text-primary flex items-center hover:underline">
                  Watch
                  <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
