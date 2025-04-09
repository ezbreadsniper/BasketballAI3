import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Resource {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnailUrl: string;
  difficulty: string;
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/training/resources/all'],
  });

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-1" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-8 w-96 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  // Default resources if API returns nothing
  const defaultResources: Resource[] = [
    {
      id: 1,
      title: "Free Throw Form Breakdown",
      description: "Pro coach analysis of proper free throw mechanics and consistent shooting form.",
      duration: "8 minutes",
      category: "Shooting",
      difficulty: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 2,
      title: "Advanced Dribbling Series",
      description: "Five-part training series focused on weak hand development and combo moves.",
      duration: "25 minutes",
      category: "Ball Handling",
      difficulty: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 3,
      title: "Vertical Jump Training",
      description: "Progressive plyometric program to increase explosive power and vertical leap.",
      duration: "18 minutes",
      category: "Athletic Training",
      difficulty: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 4,
      title: "Pick and Roll Mastery",
      description: "Learn the nuances of basketball's most effective offensive action from both positions.",
      duration: "22 minutes",
      category: "Team Play",
      difficulty: "Advanced",
      thumbnailUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 5,
      title: "Defensive Footwork Drills",
      description: "Essential footwork patterns and exercises to improve lateral quickness and defensive positioning.",
      duration: "15 minutes",
      category: "Defense",
      difficulty: "Beginner",
      thumbnailUrl: "https://images.unsplash.com/photo-1518908336710-4e1cf821d3d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: 6,
      title: "Post Move Fundamentals",
      description: "Master the basic post moves and counters to become a threat in the paint.",
      duration: "30 minutes",
      category: "Post Play",
      difficulty: "Intermediate",
      thumbnailUrl: "https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  const displayResources = resources || defaultResources;
  
  // Filter resources by search query
  const filteredResources = displayResources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'elite':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Skill Development Resources</h1>
        <p className="text-neutral-600">Access training videos, tutorials, and basketball knowledge</p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-neutral-400" />
        </div>
        <Input
          type="text"
          placeholder="Search resources..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="shooting">Shooting</TabsTrigger>
          <TabsTrigger value="dribbling">Ball Handling</TabsTrigger>
          <TabsTrigger value="defense">Defense</TabsTrigger>
          <TabsTrigger value="athletic">Athletic Training</TabsTrigger>
          <TabsTrigger value="team">Team Play</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="overflow-hidden flex flex-col">
            <div className="relative">
              <img 
                src={resource.thumbnailUrl} 
                alt={resource.title} 
                className="h-48 w-full object-cover"
              />
              <div className="absolute bottom-3 right-3">
                <Badge variant="secondary" className={getDifficultyColor(resource.difficulty)}>
                  {resource.difficulty}
                </Badge>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 bg-black bg-opacity-60 rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-70 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">{resource.title}</h3>
              <p className="text-sm text-neutral-600 mb-3 flex-1">{resource.description}</p>
              <div className="flex items-center justify-between text-xs font-medium text-neutral-500 mt-auto">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {resource.duration}
                </span>
                <Badge variant="outline">{resource.category}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
