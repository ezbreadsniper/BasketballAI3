import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Award, Code } from "lucide-react";

interface TrainingRecommendation {
  id: number;
  title: string;
  description: string;
  duration: string;
  priority: string;
  category: string;
  icon: string;
}

export default function AITrainingRecommendations() {
  const { data: recommendations, isLoading } = useQuery<TrainingRecommendation[]>({
    queryKey: ['/api/training/recommendations'],
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border-b border-neutral-200">
              <div className="flex items-start">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-24 mr-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default recommendations if API returns nothing
  const defaultRecommendations: TrainingRecommendation[] = [
    {
      id: 1,
      title: "Focus on Shooting Mechanics",
      description: "Your shooting form shows inconsistency in release point. Focus on form shooting drills this week.",
      duration: "40 minutes daily",
      priority: "High",
      category: "shooting",
      icon: "clock"
    },
    {
      id: 2,
      title: "Ball Handling Improvement",
      description: "Your right-hand dominant dribbling pattern is predictable. Focus on weak-hand drills.",
      duration: "25 minutes daily",
      priority: "Medium",
      category: "dribbling",
      icon: "code"
    },
    {
      id: 3,
      title: "Vertical Jump Training",
      description: "Your explosive power metrics are improving. Continue plyometric training with progressive overload.",
      duration: "30 minutes, 3x weekly",
      priority: "Medium",
      category: "athletic",
      icon: "award"
    }
  ];

  const displayRecommendations = recommendations || defaultRecommendations;
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock':
        return <Clock className="h-6 w-6" />;
      case 'award':
        return <Award className="h-6 w-6" />;
      case 'code':
        return <Code className="h-6 w-6" />;
      default:
        return <Clock className="h-6 w-6" />;
    }
  };
  
  const getBgColor = (category: string) => {
    switch (category) {
      case 'shooting':
        return 'bg-primary-light';
      case 'dribbling':
        return 'bg-secondary-light';
      case 'athletic':
        return 'bg-accent';
      default:
        return 'bg-primary-light';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">AI Training Recommendations</h2>
        <span className="px-3 py-1 text-xs font-medium text-white bg-accent rounded-full">AI-Powered</span>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {displayRecommendations.map((recommendation, index) => (
          <div 
            key={recommendation.id} 
            className={`p-6 ${index !== displayRecommendations.length - 1 ? 'border-b border-neutral-200' : ''}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg ${getBgColor(recommendation.category)} flex items-center justify-center text-white`}>
                  {getIcon(recommendation.icon)}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-base font-semibold text-neutral-900 mb-1">{recommendation.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{recommendation.description}</p>
                <div className="flex items-center text-xs font-medium text-neutral-500">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {recommendation.duration}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {recommendation.priority} priority
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="w-full px-4 py-2 border border-primary text-sm font-medium rounded-md text-primary hover:bg-primary hover:bg-opacity-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                View Detailed Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
