import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Award, Dumbbell, Target, Flag, ArrowRightCircle, Lightbulb, Sparkles } from "lucide-react";

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
      <div className="bg-neutral-800 border border-neutral-700 rounded-sm">
        <div className="border-b border-neutral-700 px-3 py-2">
          <Skeleton className="h-5 w-40 bg-neutral-700" />
        </div>
        <div className="p-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-750 border border-neutral-700 rounded-sm p-3">
              <div className="flex">
                <Skeleton className="h-10 w-10 rounded-sm bg-neutral-700" />
                <div className="ml-3 flex-1">
                  <Skeleton className="h-4 w-40 mb-2 bg-neutral-700" />
                  <Skeleton className="h-3 w-full mb-2 bg-neutral-700" />
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-20 mr-2 bg-neutral-700" />
                    <Skeleton className="h-3 w-20 bg-neutral-700" />
                  </div>
                </div>
              </div>
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
        return <Target className="h-4 w-4 text-white" />;
      case 'award':
        return <Dumbbell className="h-4 w-4 text-white" />;
      case 'code':
        return <Flag className="h-4 w-4 text-white" />;
      default:
        return <Target className="h-4 w-4 text-white" />;
    }
  };
  
  const getBgColor = (category: string) => {
    switch (category) {
      case 'shooting':
        return 'bg-blue-600';
      case 'dribbling':
        return 'bg-yellow-600';
      case 'athletic':
        return 'bg-green-600';
      default:
        return 'bg-blue-600';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-sm h-full">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <div className="flex items-center">
          <Lightbulb className="h-3.5 w-3.5 text-yellow-400 mr-2" />
          <h2 className="text-xs font-semibold text-neutral-100 uppercase">AI Training Recommendations</h2>
        </div>
        <div className="px-1.5 py-0.5 text-[10px] font-medium text-yellow-900 bg-yellow-400 rounded-sm flex items-center">
          <Sparkles className="h-2.5 w-2.5 mr-1" />
          AI-POWERED
        </div>
      </div>
      
      <div className="p-3 space-y-3 overflow-auto max-h-[400px]">
        {displayRecommendations.map((recommendation) => (
          <div 
            key={recommendation.id} 
            className="bg-neutral-750 border border-neutral-700 rounded-sm p-3 hover:bg-neutral-700 transition-colors"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${getBgColor(recommendation.category)} flex items-center justify-center rounded-sm`}>
                  {getIcon(recommendation.icon)}
                </div>
              </div>
              <div className="ml-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-medium text-neutral-100">{recommendation.title}</h3>
                  <span className={`text-[10px] font-medium ${getPriorityColor(recommendation.priority)}`}>
                    {recommendation.priority}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mb-2 line-clamp-2">{recommendation.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-[10px] text-neutral-500">
                    <Clock className="h-3 w-3 mr-1 text-neutral-500" />
                    {recommendation.duration}
                  </span>
                  <button className="text-[10px] text-primary flex items-center hover:underline">
                    Start
                    <ArrowRightCircle className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
