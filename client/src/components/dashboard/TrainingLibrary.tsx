import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

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
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border-b border-neutral-200">
              <div className="flex">
                <Skeleton className="h-24 w-36 rounded-lg" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-20 mr-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Skill Development Resources</h2>
        <button className="text-sm font-medium text-secondary hover:text-secondary-dark">View All</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {displayResources.map((resource, index) => (
          <div 
            key={resource.id} 
            className={`p-6 ${index !== displayResources.length - 1 ? 'border-b border-neutral-200' : ''}`}
          >
            <div className="flex">
              <div className="flex-shrink-0 relative">
                <img 
                  src={resource.thumbnailUrl} 
                  alt={resource.title} 
                  className="h-24 w-36 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-base font-semibold text-neutral-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-neutral-600 mb-2">{resource.description}</p>
                <div className="flex items-center text-xs font-medium text-neutral-500">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {resource.duration}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">{resource.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
